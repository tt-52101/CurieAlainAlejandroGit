import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STColumnBadge } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { DiConnectionsEditComponent } from './edit/edit.component';
import { DiConnectionsViewComponent } from './view/view.component';
import { DiConnectionsCreateComponent } from './create/create.component';
import { data } from './data';
import { deepCopy } from '@delon/util';
import { PdiService } from '@core/services/pdi.service';
import { DiConnectionsLogComponent } from './log/log.component';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

/**Muestra información sobre el DI */
@Component({
  selector: 'app-di-connections',
  templateUrl: './connections.component.html',
})
export class DiConnectionsComponent implements OnInit {
  data
  template;
  @ViewChild("li") myButton;
  data_copy = this.data;
  BADGE: STColumnBadge = {
    0: { text: 'Error', color: 'error' },
    1: { text: 'Activo', color: 'success' },
    2: { text: 'Inactivo', color: 'default' },
    3: { text: 'Procesando', color: 'processing' },
    4: { text: 'Warning', color: 'warning' },
  };
  searchSchema: SFSchema = {
    properties: {
      nombre: {
        type: 'string',
        title: 'Number'
      }
    }
  };
  @ViewChild('st') st: STComponent;
  @ViewChild('inp') inp: any;
  params: any = { name: '' };
  columns: STColumn[] = [
    { title: 'Nombre', index: 'nombre', sort: { compare: (a: any, b: any) => ('' + a.nombre).localeCompare(b.nombre), }, },
    { title: 'Origen', index: 'origen', sort: { compare: (a: any, b: any) => ('' + a.origen).localeCompare(b.origen), }, },
    { title: 'Destino', index: 'destino', sort: { compare: (a: any, b: any) => ('' + a.destino).localeCompare(b.destino), }, },
    { title: 'Fecha de creacion', index: 'f_creacion', type: 'date', },
    {
      title: '',
      buttons: [
        { text: 'Ver', click: (item: any) => this.view(item) },
        { text: 'Edit', type: 'static', click: (item: any) => this.edit(item) },
        { text: 'Log', type: 'static', click: (item: any) => this.log(item) },
      ]
    }
  ];

  constructor(private http: _HttpClient, private modal: ModalHelper, private NewModel: NzModalService, private pdiService: PdiService) { }

  async ngOnInit() {
    /* await this.pdiService.getToken().toPromise();
    await this.pdiService.getIframe().toPromise(); */
    await this.listOfDataKtr();
  }

  /**
   * Lee el directorio donde estan almacenados los ktr(transforms) y los lista para poder verlos en la tabla.
   */
  async listOfDataKtr() {
    try {
      const list = await this.pdiService.getListKtr().toPromise();
      this.template = await this.pdiService.getTemplatesKtr().toPromise();
      this.data = list;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Ejecución de tranform que encrypta las contraseñas llamando al web services localhost:8081/kettle/...
   */
  async executeTransform() {
    try {
      const transfom = await this.pdiService.executeTransform().toPromise();
    } catch (error) {
      console.log(error);
    }
  }

  /**Funcion para añadir un nuevo elemento, lanza un modal para rellenar los datos */
  add(template: any) {
    const modaledit = this.NewModel.create({
      nzTitle: 'Crear nueva conexion',
      nzContent: DiConnectionsCreateComponent,
      nzComponentParams: {
        schema: {
          properties: {
            nombre: { type: 'string', title: 'Nombre' },
            tiempo: { type: 'number', title: 'Tiempo' },
            frecuencia: {
              type: 'string', title: 'Frecuencia',
              enum: [
                { label: "Minuto", value: "minuto" },
                { label: "Hora", value: "hora" },
                { label: "Dia de la semana", value: "dia de la semana" },
                { label: "Mes", value: "mes" },
                { label: "Dia del mes", value: "dia del mes" },
              ]
            },
            estado: {
              type: 'number', title: 'Estado',
              enum: [
                { label: "Activo", value: 1 },
                { label: "Error", value: 0 },
                { label: "Inactivo", value: 2 },
                { label: "Procesando", value: 3 },
                { label: "Warning", value: 4 },
              ],
              ui: {
                widget: 'select',
              }
            },
            origen: { type: 'string', title: 'Origen' },
            origenhostname: { type: 'string', title: 'Hostname' },
            origendatabase: { type: 'string', title: 'Base de datos' },
            origenport: { type: 'string', title: 'Puerto' },
            origenuser: { type: 'string', title: 'User' },
            origenpass: { type: 'string', title: 'Password' },
            destino: { type: 'string', title: 'Destino' },
            desthostname: { type: 'string', title: 'Hostname' },
            destdatabase: { type: 'string', title: 'Base de datos' },
            destport: { type: 'string', title: 'Puerto' },
            destuser: { type: 'string', title: 'User' },
            destpass: { type: 'string', title: 'Password' }
          },
          required: ['origen', 'nombre', 'origenuser', 'destuser', 'tiempo', 'frecuencia', 'origenport', 'destport'],
        }
      },
      nzOnOk: () => {
        console.log(this.myButton);
        let newItem = modaledit.getContentComponent().div1._item;
        modaledit.getContentComponent().save(newItem, template);
        console.log(modaledit.getContentComponent());
      },
      nzOnCancel: () => {
        close();
      }
    });
  }

  /**Compara las propiedades EN COMÚN de 2 JSON
   *
   * Se presupone que son del mismo tipo
   *
   * Se leen las propiedades de a, SOLO si b tiene esa propiedad se comprueba si son iguales, en caso de
   * no serlo se devuelve false
   *
   * Si dos json no comparten propiedades se devolverá true
   */
  compareJSON(a, b): boolean {
    const a_keys = Object.keys(a);
    for (let k in a_keys) {
      if (b.hasOwnProperty(a_keys[k]) && (a[a_keys[k]] !== b[a_keys[k]])) return false
    }
    return true
  }
  /** Busca un elemento y devuelve su posición */
  find(item: any): number {
    for (let i = 0; i < data.length; i++) {
      if (this.compareJSON(data[i], item)) return i;
      else { console.log(JSON.stringify(data[i])); console.log(JSON.stringify(item)) }
    }
    return -1;
  }
  /**Funcion para editar un elemento, lanza un modal para rellenar los datos */
  edit(item: any) {
    const modaledit = this.NewModel.create({
      nzTitle: 'Edición de conexiones',
      nzContent: DiConnectionsEditComponent,
      nzComponentParams: {
        schema: {
          properties: {
            nombre: { type: 'string', title: 'Nombre' },
            tiempo: { type: 'number', title: 'Tiempo' },
            frecuencia: {
              type: 'string', title: 'Frecuencia',
              enum: [
                { label: "Minuto", value: "minuto" },
                { label: "Hora", value: "hora" },
                { label: "Dia de la semana", value: "dia de la semana" },
                { label: "Mes", value: "mes" },
                { label: "Dia del mes", value: "dia del mes" },
              ]
            },
            estado: {
              type: 'number', title: 'Estado',
              enum: [
                { label: "Activo", value: 1 },
                { label: "Error", value: 0 },
                { label: "Inactivo", value: 2 },
                { label: "Procesando", value: 3 },
                { label: "Warning", value: 4 },
              ],
              ui: {
                widget: 'select',
              }
            },
            origen: { type: 'string', title: 'Origen' },
            origenhostname: { type: 'string', title: 'Hostname' },
            origendatabase: { type: 'string', title: 'Base de datos' },
            origenport: { type: 'string', title: 'Puerto' },
            origenuser: { type: 'string', title: 'User' },
            origenpass: { type: 'string', title: 'Password' },
            destino: { type: 'string', title: 'Destino' },
            desthostname: { type: 'string', title: 'Hostname' },
            destdatabase: { type: 'string', title: 'Base de datos' },
            destport: { type: 'string', title: 'Puerto' },
            destuser: { type: 'string', title: 'User' },
            destpass: { type: 'string', title: 'Password' }
          },
          required: ['origen', 'nombre', 'origenuser', 'destuser', 'tiempo', 'frecuencia'],
        },
        schema2: item
      },
      nzOnOk: () => {
        let newItem = modaledit.getContentComponent().div1._item;
        modaledit.getContentComponent().save(newItem);
      },
      nzOnCancel: () => {
        close();
      }
    });
  }
  /**Funcion para ver un elemento, lanza un modal para ver los datos */
  view(item: any) {
    this.NewModel.create({
      nzTitle: 'Datos de conexión',
      nzContent: DiConnectionsViewComponent,
      nzComponentParams: {
        schema: item,
      },
      nzOnOk: () => {
        close();
      },
      nzOnCancel: () => {
        close();
      }
    });
  }

  async log(item: any) {
    let correct = 1;
    try {
      const status = await this.pdiService.statusCronJob(item).toPromise();
    } catch (error) {
      console.log(error);
      correct = 2
    } finally {
      const datos = await this.pdiService.json().toPromise();
      for (const key in datos) {
        if (datos[key].nombre == item.nombre) {
          item.frecuencia = datos[key].frecuencia
          if (correct == 1) {
            item.estado = datos[key].estado
          } else {
            item.estado = 2
            item.frecuencia = "-"
          }
        }
      }
    }
    this.NewModel.create({
      nzTitle: 'Estado de la conexión',
      nzContent: DiConnectionsLogComponent,
      nzComponentParams: {
        schema: item,
      },
      nzOnOk: () => {
        close();
      },
      nzOnCancel: () => {
        close();
      }
    });
  }

  /**Funcion para filtrar los datos*/
  search(): void {
    this.data = this.data_copy;
    this.data = deepCopy(this.data_copy).filter(w => ~w.nombre.indexOf(this.params.name));
  }
  /**Resetea el campo de búsqueda y vuelve a mostrar todas las entradas de la tabla */
  reset_search(): void {
    this.params.name = '';
    this.data = this.data_copy;
  }

}
