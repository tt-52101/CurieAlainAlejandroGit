import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CrmService } from '@core/services/crm.service';
import { Ticket } from '@shared/models/Ticket';
import { Agreement, Client, Contact, userToAssign, CallModalFormReturn } from '@shared/typings/call-modal.component';
import { Modules } from '@shared/utils/modules.enum';
import { NzMessageService } from 'ng-zorro-antd';
import { LoginService } from '@core';
import * as moment from 'moment';
import { replaceTildes } from '@shared/utils/string.utils';
import { tap } from 'rxjs/operators';
import { Incidence } from '@shared/models/Incidence';
import { ImputationComponent } from '../../imputation.component';

@Component({
  selector: 'app-call-modal-form',
  templateUrl: './call-modal-form.component.html',
  styleUrls: ['./call-modal-form.component.less']
})
export class CallModalFormComponent implements OnInit {

  @Output() private close: EventEmitter<any> = new EventEmitter<any>(null);

  taskServerSearch = false;
  incidenceModel: Ticket = new Ticket();
  newIncidence: Ticket = new Ticket({
    user: 9,
    name: 'Llamada',
    parent: new Array(3).fill({
      id: null,
      label: null,
      mod: null,
      responsible: {
        id: null,
        label: null
      }
    })
  });
  start_date: Date;
  end_date: Date;
  agreements: Agreement[] = [];
  clients: Client[] = [];
  clientContact: Contact[] = [];
  usersToAssign: userToAssign[] = [];
  copyUsers: userToAssign[];
  radioOptions = [
    {
      value: Modules.incidencias,
      label: 'Incidencia'
    },
    {
      value: Modules.actividades,
      label: 'Actividad'
    },
  ]
  parent = {
    contact: {
      id: null,
      mod: Modules.contactos
    },
    contract: {
      id: null,
      mod: Modules.contratos
    },
    client: {
      id: null,
      mod: Modules.clientes
    }
  }

  constructor(
    private loginService: LoginService,
    private messages: NzMessageService,
    private crm: CrmService,
    public impt: ImputationComponent
  ) { }

  /**
   * Inicia la hora de inicio de incidencia y carga los datos para seleccionar empresa
   */
  ngOnInit() {
    this.start_date = new Date();
    this.getSelectData();
  }

  /**
   * Llena el select de empresa con la información correspondiente para cargar otros datos del formulario
   */
  async getSelectData() {
    try {
      this.clients = await this.crm.getLists(Modules.clientes, {}).toPromise(); // empresas
    } catch (error) {
      this.messages.error(`There was an error ${error.error}`);
      console.error(error);
    }
  }

  /**
   * Filtra los datos en función del cliente elegido en la incidencia
   * @param idCompany
   */
  async changeSelectData(idCompany: number) {
    const params: object = { account: idCompany };

    try {
      this.agreements = await this.crm.getLists(Modules.formulario_atencion_telefonica, { params: { modules: [Modules.contratos], ...params } }).toPromise(); // Contratos
      this.clientContact = await this.crm.getLists(Modules.formulario_atencion_telefonica, { params: { modules: [Modules.contactos], ...params } }).toPromise(); // Trabajadores de la empresa de la incidencia responsables de la llamada (Quíen comunica la incidencia)
      this.usersToAssign = await this.crm.getLists(Modules.formulario_atencion_telefonica, { params: { modules: [Modules.usuarios], ...params } }).toPromise(); // Usuarios de mi empresa para asignar la tarea
      this.copyUsers = [...this.usersToAssign];
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Envía el formulario de creación de incidencia
   */
  async handleOk() {
    try {
      const toReturn: CallModalFormReturn = {
        name: this.newIncidence.name || 'Llamada',
        description: this.newIncidence.description || '',
        date_start: this.start_date,
        date_end: new Date(),
        visible: false,
        parent: [{}],
        user: { id: this.loginService.user.id, label: '' },
        ticket: {
          id: this.newIncidence.id || 349,
          mod: this.newIncidence.mod || Modules.tareas,
          label: this.newIncidence.name || 'Atención telefónica',
          description: this.newIncidence.description
        }
      }
      // console.log(toReturn);
      this.close.next(toReturn);
    } catch (error) {
      console.error(error);
      this.messages.error(error);
    }
  }

  /**
   * Cancela y esconde la creación de la incidencia
   */
  handleCancel() {
    const toReturn: CallModalFormReturn = {
      name: null,
      description: null,
      date_start: null,
      date_end: null,
      visible: false,
      ticket: null,
      parent: null,
      user: null
    }

    this.close.next(toReturn);
  }

  /**
   * Crea incidencia o actividad según se haya marcado en el modal
   */
  async incidenceCreation() {
    let fecha = moment(this.start_date).format('YYYY-MM-DD HH:mm:ss').replace('/', '-');
    fecha = fecha.replace('/', '-');

    if (this.newIncidence.mod === undefined)
      this.newIncidence.mod = Modules.incidencias;

    try {
      const toReturnII: Incidence = new Incidence({
        mod: Modules.actividades,
        user: this.newIncidence.user,
        name: this.newIncidence.name,
        description: this.newIncidence.description,
        date_start: this.start_date,
        date_end: this.end_date,
        parent: Object.values(this.parent),
        status: {
          main: '',
          secondary: {}
        }
      });

      await this.crm.createRecord(Modules.kanban, toReturnII.export()).pipe(tap(res => {
        this.close.next(toReturnII);
        this.messages.success('Incidencia creada con éxito');
      })).toPromise();
    } catch (error) {
      console.error(error);
      this.messages.error(error);
    }
  }

  /**
   * Ignora las tíldes cuando despliega el select de usuarios
   */
  searchName(personName: string) {
    this.usersToAssign = [...this.copyUsers];
    if (personName.length > 0) {
      const searchedName = replaceTildes(personName).toLowerCase();
      this.usersToAssign = this.usersToAssign.filter(e => replaceTildes(e.label).toLowerCase().includes(searchedName));
      if (this.usersToAssign.length < 1) {
        this.usersToAssign = [...this.copyUsers];
      }
    }
  }

  /**
   * Actualiza el valor de la propiedad parent del objeto newIncidence
   * @param value
   * @param module
   */
  updateParent(value: number, module: string) {
    this.newIncidence.parent[this.newIncidence.parent.findIndex(e => e.mod === module)].id = value;
  }
}
