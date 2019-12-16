import { GenericModel } from '@shared/models/GenericModel';
import { BasicInfo, ParentInfo, Status, StatusOption, PriorityI } from '@shared/typings/Ticket.d';
import { colors, statusRelationship, CrmStatus, CrmSubStatus } from '@shared/typings/Ticket_enum.enum';
import { Modules } from '@shared/utils/modules.enum';
import * as moment from 'moment';

export class Ticket extends GenericModel {

  id: number = null;
  project: string = null;
  client: string = null;
  user: BasicInfo = null;
  parent: ParentInfo[] = null;
  responsible: BasicInfo = null;
  name: string = null;
  description: string = null;
  counter: number = null;
  status: Status = null;
  maxDate: Date = null;
  date_start: Date = null;
  date_end: Date = null;
  progress: number = null;
  priority: PriorityI = null;
  protected _mod: Modules = null;

  constructor(params?: any) {
    super();
    this.exclusions = [
      {
        field: 'progress',
        handler: (progress: string) => {
          if (/\d*%$/.test(progress)) {
            this.progress = +progress.replace('%', '')
          }
        }
      },
      {
        field: 'status',
        handler: () => {
          if (!!params.status && params.mod === Modules.tareas) {
            this.status = { ...params.status };
            const substatus = this.status.secondary.value as CrmSubStatus;
            this.changeStatus(this.status.main.value as CrmStatus, substatus || undefined );
          }
        }
      },
      {
        field: 'description',
        handler: () => {
          if (params.parent[0].label !== params['name']) {
            this.description = params['name'];
          }
        }
      },
      {
        field: 'priority',
        handler: () => {
          this.priority = { order: params['priority'] !== undefined ? +params['priority']['order'] : 0 };
        }
      },
      {
        field: 'project',
        handler: () => {
          this.project = params.parent[0].label
        }
      }
    ];
    this.constructorParse(params);
  }


  /**
   * Cambia el subestado en consecuencia con el estado principal
   */
  toggleStatus(direction: number): void {
    let actualIndex: number = statusRelationship[this.status.main.value].substatus.findIndex(e => e.value === this.status.secondary.value);
    const total = statusRelationship[this.status.main.value].substatus.length;
    actualIndex += direction;
    if (actualIndex < 0) {
      actualIndex = total - 1;
    } else if (actualIndex >= total) {
      actualIndex = 0;
    }
    this.status.secondary = statusRelationship[this.status.main.value].substatus[actualIndex];
  }


  /**
   * Cambia el estado (y por lo tanto el subestado) de la tarea.
   * @param newStatus Nuevo estado
   * @param subStatus nuevo subestado, por defecto tendrá el primero de la lista
   */
  changeStatus(newStatus: CrmStatus, subStatus?: CrmSubStatus): void {
    let subStatusIndex: number = 0;
    const aux = [...statusRelationship[newStatus].substatus];
    if (subStatus !== undefined) {
      subStatusIndex = aux.findIndex((e: any) => e.value === subStatus);
    }
    this.status = {
      main: {
        value: newStatus,
        label: statusRelationship[newStatus].label
      },
      secondary: { ...statusRelationship[newStatus].substatus[subStatusIndex] }
    }
  }



  /**
   * Prepara la tarea para ser el parent de una imputacion
   * @returs configuracion para ser parent
   */
  convertInParent(): object {
    return super.export({ required: ['id', 'name'], rename: [{ from: 'name', to: 'label' }] });
  }

  /**
   * Exporta a objeto plano y formateado los datos de esta clase
   * @returns objeto plano
   */
  export() {
    const toReturn: any = super.export({ rename: [{ from: '_mod', to: 'mod' }] });
    toReturn.user = this.user.id;
    if (this.status) {
      Object.keys(toReturn.status).forEach(e => {
        toReturn.status[e] = this.status[e].value;
      })
    }
    ['start', 'end'].forEach(e => {
      toReturn[`date_${e}`] = moment(this[`date_${e}`]).format('YYYY-MM-DD');
      if (this._mod === Modules.actividades || this._mod === Modules.imputaciones) {
        toReturn[`time_${e}`] = moment(this[`date_${e}`]).format('HH:mm:ss');
      }
    });
    return toReturn;
  }



  /**
   * Clona el objeto
   */
  clone(): Ticket {
    return this.copy(this);
  }

  // GETTERS AND SETTERS
  get mod(): Modules {
    return this._mod;
  }

  set mod(newModule: Modules) {
    this._mod = newModule;
  }
}

