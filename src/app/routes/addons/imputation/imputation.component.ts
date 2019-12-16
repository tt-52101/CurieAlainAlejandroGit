import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CrmService } from '@core/services/crm.service';
import { LoginService } from '@core/services/login.service';
import { SpinerFactoryService } from '@core/services/spiner-factory.service';
import { FullContentService } from '@delon/abc';
import { Imputation } from '@shared/models/Imputation';
import { Ticket } from '@shared/models/Ticket';
import { CallModalFormReturn } from '@shared/typings/call-modal.component';
import { CrmStatus, CrmSubStatus } from '@shared/typings/Ticket_enum.enum';
import { DateWithoutOffset, decimalToSexagesimal, defaultConfigDatePickers } from '@shared/utils/dateUtils';
import { Modules } from '@shared/utils/modules.enum';
import { replaceTildes } from '@shared/utils/string.utils';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd';
import { map, tap } from 'rxjs/operators';
@Component({
  selector: 'app-imputation',
  templateUrl: './imputation.component.html',
  styleUrls: ['./imputation.component.less']
})
export class ImputationComponent implements OnInit, AfterViewInit {

  datepickerConfig = defaultConfigDatePickers;
  cronoInitValue: string;
  hideQuickImputation = false;
  tickets: Imputation[] = [];
  tasks: Ticket[] = [];
  incidences: Ticket[] = [];
  ticketsCopy: Imputation[] = [];
  projects: string[] = [];
  copyProjects: string[] = [];
  copyTasks: Ticket[] = [];

  disabledHigherDates = (current: Date): boolean => {
    // Can not select days before today and today
    return differenceInCalendarDays(current, new Date()) > 0;
  };

  date = new Date();
  refreshSpin = false;
  isVisible = false;
  isStarted = false;
  taskServerSearch = false;
  initTime = null;
  timerTimeOut: any;
  counter = 0;
  selectedRegister: Imputation[] = [];
  tableLoading = false;

  workedHours: number;
  maxViewImputations = 10;

  editCache: { [key: string]: any } = {};

  // Properties for sort and filter

  sortName: string | null = null;
  sortValue: string | null = null;
  searchAddress: string;
  listOfSearchName: string[] = [];
  listOfDisplayData = [...this.tickets];

  constructor(
    private loginService: LoginService,
    private full: FullContentService,
    private crm: CrmService,
    private messages: NzNotificationService,
    private spinnerService: SpinerFactoryService
  ) { }

  async ngOnInit() {
    this.full.toggle()
    await this.getData();
  }

  ngAfterViewInit() {
    // estilos necesarios para activar la seccion de tareas masivas
    (document.querySelector('.masiveActions > .ant-table-header-column') as HTMLElement).setAttribute('style', 'width:100%;');
    (document.querySelector('.masiveActions > .ant-table-header-column > div') as HTMLElement).setAttribute('style', 'width:100%;');
  }

  /**
   * Refresca las imputaciones
   * @param newDate busca imputaciones en una fecha dada
   * @param refres indica si se está refrescando u obteniendo por primera vez
   */
  async refreshData(newDate?: Date, refresh: boolean = false) {
    this.refreshSpin = refresh;
    this.hideQuickImputation = moment(moment(newDate).format('YYYY-MM-DD')).isBefore(moment(moment().format('YYYY-MM-DD')));
    try {
      this.tickets = await this.crm.getLists(Modules.kanban, {
        params: {
          modules: [Modules.imputaciones],
          users: [this.loginService.user.id],
          date_start: moment(this.date).format('YYYY-MM-DD'),
          date_end: moment(this.date).format('YYYY-MM-DD'),
          order: ['date_start', 'asc']
        }
      }).pipe(
        map(res => res.map(e => {
          const data = new Imputation(e);
          if (data.parent[0].id === 107426) {
            data.parent[0].label = '';
          }
          this.editCache[data.id.toString()] = {
            edit: false,
            data
          }
          return data;
        }).filter(e => e.parent.length > 0))
      ).toPromise();
      this.ticketsCopy = [...this.tickets];
      await this.getTasks();
      if (refresh) {
        this.messages.info('Registros actualizados', '');
      }
    } catch (error) {
      console.error(error);
      this.messages.error('Error al obtener los datos', '');
    } finally {
      this.refreshSpin = false;
    }
    this.addTask();
    this.calculateWorkedHours();
  }

  async getTasks() {
    this.tasks = await this.crm.getLists(Modules.kanban, {
      params: {
        modules: [Modules.tareas, Modules.actividades, Modules.incidencias],
        users: [this.loginService.user.id],
        status: [`!${CrmStatus.done}`]
      }
    }).pipe(
      // FIXME: quitar filtro
      map(res => res.filter(e => e.mod !== 'IStorages' && e.parent.length > 0).map(e => new Ticket(e))),
    ).toPromise();
    this.projectGroup();
    this.copyTasks = [...this.tasks];
    this.copyProjects = [...this.projects];
  }
  /**
   * Obtiene los datos iniciales
   */
  async getData() {
    this.tableLoading = true;
    try {
      await this.getTasks();
      await this.refreshData();
    } catch (error) {
      console.error(error);
      this.messages.error('Hubo un problema con la conexión, inténtelo más tarde', '');
    } finally {
      this.tableLoading = false;
    }
  }

  /**
   * Obtiene los proyectos en base a las tareas
   */
  projectGroup() {
    this.projects = this.tasks.reduce((prev: string[], actual: Ticket) => {
      if (!prev.includes(actual.parent[0].label)) {
        prev.push(actual.parent[0].label);
      }
      return prev;
    }, []).sort();
  }

  /**
   * Se usa para la agrupacion de las tareas
   * @param project proyecto a consultar
   * @return tareas del proyecto especificado
   */
  ticketsGroup(project: string): Ticket[] {
    return this.tasks.filter((e: Ticket) => e.parent[0].label === project);
  }

  /**
   * Añade una nueva tarea vacia o recoge la que se está ejecutando en este momento
   */
  async addTask() {
    const doingTask: Imputation = this.tickets.find((e: Imputation) => this.checkIsQuickImputation(e));
    if (doingTask === undefined) {
      if (this.isStarted) {
        this.isStarted = false;
      }
      const aux_date: string = this.tickets.length > 0 ? moment(this.tickets[this.tickets.length - 1].date_end).format('HH:mm') : moment().format('HH:mm');
      const data = new Imputation({
        date_start: moment(this.date).format('YYYY-MM-DD'),
        time_start: aux_date,
        date_end: moment(this.date).format('YYYY-MM-DD'),
        time_end: aux_date,
        user: {
          id: this.loginService.user.id,
          label: this.loginService.user.name
        },
        parent: [
          {
            id: 107426,
            label: '',
            mod: Modules.tareas,
            responsible: {
              id: null,
              label: null
            }
          }
        ]
      });
      this.editCache[data.id] = { edit: true, data }
      this.tickets = [...this.tickets, data];
      this.orderImputations();
    } else {
      this.isStarted = true;
      const difference: number = moment().diff(doingTask.date_start, 'seconds');
      this.cronoInitValue = decimalToSexagesimal(difference);
      this.editCache[doingTask.id] = { edit: true, doingTask }
    }
  }

  chekOverlap(data: Imputation) {
    this.tickets.every(e =>
      (moment(data.date_start).isAfter(e.date_start) && moment(data.date_start).isBefore(e.date_end)) || (moment(data.date_end).isAfter(e.date_start) && moment(data.date_end).isBefore(e.date_end))
    )
  }

  /**
   * Comprueba si se está ejectando una imputacion rapida
   */
  checkIsQuickImputation(imputation: Imputation) {
    return moment(imputation.date_start).isSame(imputation.date_end);
  }
  /**
   * Crea y edita imputaciones de temporales
   * @param data Objeto imputacion a tratar (si no existe id será una nueva imputación)
   * @param sudo Evita las comprobaciones de usuario
   */
  async saveEdit(data: Imputation, options: { index?: number, sudo?: boolean } = {}) {
    if (options.index !== undefined) {
      [].slice.call(document.querySelectorAll(`tr:nth-child(${options.index}) input[type=time]`)).map((e: any) => e.value).forEach((e: string, i: number) => {
        data.addTime(e, i % 2 === 0 ? 'start' : 'end');
      })
      data.durationUpdate();
    }
    try {
      if (((moment(data.date_start).isBefore(data.date_end) && !moment(data.date_start).isSame(data.date_end))) || options.sudo === true) {
        await this.crm.createRecord(Modules.kanban, data.export()).pipe(
          tap(res => {
            if (data.id === undefined) {
              this.editCache[res.result] = {
                edit: false,
                data: { ...this.editCache['undefined'].data }
              };
              delete (this.editCache['undefined']);
              data.id = res.result;
              this.addTask();
            } else {
              this.editCache[data.id].edit = false;
            }
          })
        ).toPromise();
        if (!this.isStarted) {
          this.orderImputations();
        }
        this.calculateWorkedHours();
        // await this.fillEmptyTimes();
        this.messages.info('Registro guardado', '');
      } else {
        this.messages.error('Compruebe que los datos son correctos', '');
      }
    } catch (error) {
      this.messages.error('Error al guardar el registro, refresque y vuelva a intentarlo', '');
      console.error(error);
    }
  }

  /**
   * Ordena las imputaciones por la fecha de inicio
   */
  orderImputations() {
    this.tickets = this.tickets.sort((a: Imputation, b: Imputation) => {
      if (navigator.userAgent.includes('Firefox')) {
        if (a.id === undefined || b.id === undefined) {
          return -1;
        }
      }
      if (moment(a.date_start).isAfter(b.date_start) || moment(a.date_start).isSame(a.date_end)) {
        return 1
      } else {
        return -1;
      }
    });
    if (this.tickets.length > 1) {
      const lastIndex: number = this.tickets.length - 1;
      this.tickets[lastIndex].addTime(this.tickets[lastIndex - 1].date_end, 'start');
      this.tickets[lastIndex].addTime(this.tickets[lastIndex - 1].date_end, 'end');
      this.tickets[lastIndex].durationUpdate();
    }
  }
  /**
   * Deshace los cambios activados en el modo edicion
   * @param id identificador de la imputacion
   */
  cancelRollBack(id: number) {
    this.editCache[id].edit = false;
    this.tickets[this.tickets.findIndex(e => e.id === id)] = this.editCache[id].data;
  }

  /**
   * Crea la imagen actual de la imputacion para su posible rollback
   * @param id identificador de la imputacion
   */
  prepareToEdit(id: number) {
    this.editCache[id].data = this.tickets.find(e => e.id === id).clone();
    this.editCache[id].edit = true;
  }

  /**
   * Elimina un registro temporal
   * @param id identificador del registro temporal
   */
  async removeTask(id: number) {
    try {
      await this.crm.removeRecord(Modules.kanban, id, { params: { mod: Modules.imputaciones, id } }).toPromise();
      this.tickets.splice(this.tickets.findIndex(e => e.id === id), 1);
      this.calculateWorkedHours();
      this.messages.info('Registro borrado', '');
    } catch (error) {
      this.messages.error('Error al borrar, refresque y vuelva a intentarlo', '');
      console.error(error);
    }
  }

  /**
   * Busca en el select de tareas por id, nombre de tare y proyecto (en ese orden)
   * @param value valor select
   * @param ticket ticket al que asignar
   */
  async searchTicket(value: string, ticket: Imputation) {
    let task: Ticket = null;
    if (value.length > 0) {
      if (!/\D/.test(value)) {
        this.taskServerSearch = true;
        task = this.tasks.find(e => e.id === +value);
        if (!task) {
          task = await this.crm.getLists(Modules.kanban, {
            params: {
              modules: [Modules.tareas, Modules.incidencias, Modules.actividades],
              id: +value
            }
          }).pipe(
            map(res => res.map(e => new Ticket(e))[0])
          ).toPromise();
          if (task !== undefined) {
            this.tasks = [...this.tasks, task] as Ticket[];
            this.copyTasks = [...this.tasks];
            this.projectGroup();
          }
        }
      } else {
        this.tasks = [...this.copyTasks];
        this.taskServerSearch = true;
        this.projects = this.projects.filter(e => replaceTildes(e.toLowerCase()).includes(replaceTildes(value.toLowerCase())));
        const ToShowTasks = this.tasks.filter(e => replaceTildes(e.name.toLocaleLowerCase()).includes(replaceTildes(value.toLocaleLowerCase())) || replaceTildes(e.parent[0].label.toLocaleLowerCase()).includes(replaceTildes(value.toLocaleLowerCase())))
        this.tasks = this.tasks.filter(e => ToShowTasks.find(y => y.id === e.id) !== undefined);
        this.tasks.forEach(e => {
          if (!this.projects.includes(e.parent[0].label)) {
            this.projects.push(e.parent[0].label);
          }
        })
      }
      if (task) {
        ticket.parent[0].id = task.id;
      }
    } else {
      this.tasks = [...this.copyTasks];
      this.projects = [...this.copyProjects]
    }
  }

  /**
   * Imputacion rapida
   */
  async quickImputation() {
    this.spinnerService.show();
    const reg: Imputation = this.tickets[this.tickets.length - 1];
    if (this.isStarted) {
      reg.addTime(new Date(), 'end');
      await this.saveEdit(reg, { sudo: true });
      await this.updateTaskStatus(reg.parent[0].id, CrmStatus.waiting, CrmSubStatus.working_time);
      this.isStarted = false;
      this.calculateWorkedHours();
      this.addTask();
    } else {
      const date = new Date();
      reg.addTime(date, 'start');
      reg.addTime(date, 'end');
      await this.saveEdit(reg, { sudo: true });
      await this.updateTaskStatus(reg.parent[0].id, CrmStatus.doing, undefined);
      // this.fillEmptyTimes();
      this.isStarted = true;
    }
    this.spinnerService.hide();
  }


  /**
   * Busca huecos entre imputaciones y los rellena con una vacia
   */
  /*   private async fillEmptyTimes() {
      console.log(this.tickets);
      const lastImputation: Imputation = this.tickets[this.tickets.length - 2];
      const actualImputation: Imputation = this.tickets[this.tickets.length - 1];
      const fillImputation: Imputation = new Imputation({
        date_start: moment(this.date).format('YYYY-MM-DD'),
        time_start: moment(lastImputation.date_end).format('HH:mm'),
        date_end: moment(this.date).format('YYYY-MM-DD'),
        time_end: moment(actualImputation.date_start).format('HH:mm'),
        user: {
          id: this.loginService.user.id,
          label: this.loginService.user.name
        },
        parent: [
          {
            id: 200861,
            label: '',
            mod: Modules.tareas,
            responsible: {
              id: null,
              label: null
            }
          }
        ]
      });
      console.log(fillImputation.export());
      try {
        await this.crm.createRecord(Modules.kanban, fillImputation.export()).pipe(
          tap(res => {
            fillImputation.id = res.result;
            this.editCache[fillImputation.id.toString()] = {
              edit: false,
              data: fillImputation
            };
            this.tickets.push(fillImputation);
            this.orderImputations();
            this.calculateWorkedHours();
          })
        ).toPromise();
      } catch (error) {
        console.log('revienta aqui');
        console.error(error);
        throw error;      
      }
    } */

  /**
   * Actualiza el estado de la tarea sobre la que se está imputando
   * @param id identificador de tarea
   * @param status estado a modificar
   */
  async updateTaskStatus(id: number, status: CrmStatus, substatus: CrmSubStatus) {
    const ticket: Ticket = this.tasks.find((e: Ticket) => e.id === id);
    if(ticket){
      ticket.changeStatus(status);
      await this.crm.createRecord(Modules.kanban, ticket.export()).toPromise();
    }
  }

  /**
   * Toogle check un registro
   * @param checked selecciona o deselcciona
   * @param imputation imputacion afectada
   */
  checkRegister(checked: boolean, imputation: Imputation) {
    if (checked) {
      this.selectedRegister.push(imputation);
    } else {
      this.selectedRegister.splice(this.selectedRegister.findIndex((e: Imputation) => e.id === imputation.id), 1);
    }
  }

  /**
   * toggle check all register
   * @param cheked selecciona o deselecciona
   */
  checkAllRegister(cheked: boolean) {
    if (cheked) {
      this.selectedRegister = this.tickets.map((e: Imputation, i: number) => {
        if (i < this.tickets.length - 1) {
          e.checked = true;
          return e;
        }
      });
    } else {
      this.tickets.forEach(e => e.checked = false);
      this.selectedRegister = [];
    }
  }

  /**
   * Establece el nombre de la tarea a la que esta asignada la imputacion en el modo de vista
   * @param ticket imputacion a actualizar
   */
  updateParentInfo(ticket: Imputation) {
    const task = this.tasks.find(e => e.id === ticket.parent[0].id) || null;
    if (task) {
      ticket.parent[0].mod = task.mod;
      ticket.parent[0].label = task.name;
    }
  }

  /**
   * Abre la incidencia en el crm
   * @param id ticket id
   * @param event evento click en el caso de que sea necesario
   */
  openTask({ mod, id }: { mod: Modules, id: number }, event?: any) {
    if (event !== undefined) {
      event.stopPropagation();
    }
    this.crm.openDetails(mod, id, this.loginService.user.id, this.loginService.usertoken);
  }

  /**
   * Calcula el total de horas trabajadas en el dia
   */
  calculateWorkedHours() {
    const aux = [...this.tickets];
    if (this.isStarted) {
      aux.splice(aux.length - 1, 1)
    }
    this.workedHours = aux.reduce((prev: number, actual: Imputation) => {
      return prev + actual.duration;
    }, 0);
  }

  /**
   * Actualiza la fecha y la hora cuando cambia el input
   * @param envent event object
   * @param date fecha/hora antigua
   * @returns fecha/hora actualizada
   */
  timePickerChange(event: any, date: Date) {
    const auxDate = new Date(`${moment(date).format('YYYY-MM-DD')}T${event.srcElement.value}:00.000Z`);
    return DateWithoutOffset(auxDate);
  }

  /**
   * Convierte una fecha en una hora
   * @param datetime fecha y hora a convertir
   * @returns hora en formato 24H
   */
  convertDateToTime(datetime: Date) {
    return moment(datetime).format('HH:mm');
  }

  /**
   * Convierte las horas decimales en horas sexagesimales
   * @param time tiempo decimal
   * @returns tiempo sexagesimal
   */
  convertToClockFormat(time: number): string {
    return decimalToSexagesimal(time);
  }

  // #region zona sin acabar
  /**
   * Guarda los registros seleccionados en la tabla
   */
  async saveSelected() {
    try {
      await this.crm.createMany(Modules.kanban, this.selectedRegister.map((e: Imputation) => {
        const toSend = e.export();
        Object.keys(toSend).filter(y => toSend[y] === undefined || toSend[y] === null).forEach(y => delete (toSend[y]));
        return toSend;
      })).toPromise();
      this.selectedRegister.forEach((e: Imputation) => {
        this.editCache[e.id.toString()].edit = false;
        e.checked = false;
      });
      this.selectedRegister = [];
      this.messages.info('Registros guardados correctamente', '');
    } catch (error) {
      console.error(error);
      this.messages.error('Error en el guardado', '');
    }
  }

  /**
   * Elimina los registros seleccionados en la tabla
   */
  async removeSelected() {
    try {
      await this.crm.removeMany(Modules.kanban, this.selectedRegister.map((e: Imputation) => {
        return {
          id: e.id,
          mod: e.mod
        }
      })).toPromise();
      this.selectedRegister.forEach((e: Imputation) => {
        this.tickets.splice(this.tickets.findIndex((y: Imputation) => y.id === e.id), 1);
      });
      this.selectedRegister = [];
      this.messages.info('Borrado correcto', '');
    } catch (error) {
      console.error(error);
      this.messages.error('Error en el borrado', '');
    }
  }

  async massiveAction(isRemove: any) {
    try {
      await this.crm[isRemove ? 'removeSelected' : 'saveSelected'](Modules.kanban, this.selectedRegister.map((e: Imputation) => {
        if (isRemove) {
          return {
            id: e.id,
            mod: e.mod
          }
        } else {
          const toSend = e.export();
          Object.keys(toSend).filter(y => toSend[y] === undefined || toSend[y] === null).forEach(y => delete (toSend[y]));
          return toSend;
        }

      })).toPromise();
      this.selectedRegister.forEach((e: Imputation) => {
        if (isRemove) {
          this.tickets.splice(this.tickets.findIndex((y: Imputation) => y.id === e.id), 1);
        } else {
          this.editCache[e.id.toString()].edit = false;
          e.checked = false;
        }
      });
      this.selectedRegister = [];
      this.messages.info('Borrado correcto', '');
    } catch (error) {
      if (isRemove ? 'borrado' : 'guardado') {
        console.error(error);
        this.messages.error(`Error en el ${isRemove} de imputaciones`, '');
      }
    }
  }

  /**
   * Crea una nueva imputación de llamada en la tabla de imputaciones
   */
  async CallAttentionHandler(data: CallModalFormReturn) {

    try {
      if (data.date_end !== null) {
        const newImputation = new Imputation({
          date_start: moment(data.date_start).format('YYYY-MM-DD'),
          time_start: moment(data.date_start).format('HH:mm').concat(':00.000'),
          date_end: moment(data.date_end).format('YYYY-MM-DD'),
          time_end: moment(data.date_end).format('HH:mm').concat(':00.000'),
          parent: [
            {
              id: data.ticket.id,
              mod: data.ticket.mod,
              label: data.ticket.label,
              description: data.ticket.description
            }
          ],
          user: {
            id: this.loginService.user.id
          }
        });

        newImputation.name = data.name;
        newImputation.description = data.description;

        await this.saveEdit(newImputation, { sudo: true });
        await this.refreshData(this.date, true);
        this.isVisible = data.visible;
      } else {
        this.isVisible = data.visible;
        this.messages.info('Nueva imputación suspendida', '');
      }
    } catch (error) {
      console.error(error);
      this.messages.error(error, '');
    }
  }
  // #endregion
}

