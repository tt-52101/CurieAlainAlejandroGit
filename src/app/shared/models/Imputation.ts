import { Modules } from '@shared/utils/modules.enum';
import * as moment from 'moment';
import { Ticket } from './Ticket';
import { DateWithoutOffset } from '@shared/utils/dateUtils';


export class Imputation extends Ticket {

  private _duration: number = 0;
  checked = false;

  constructor(params?: any) {
    super(params);
    if (params !== undefined) {
      this.constructorParse(params);
      this._mod = Modules.imputaciones;
      this.date_start = DateWithoutOffset(moment(`${moment(this.date_start.toISOString()).format('YYYY-MM-DD')}T${params.time_start}Z`).toDate());
      this.date_end = DateWithoutOffset(moment(`${moment(this.date_end.toISOString()).format('YYYY-MM-DD')}T${params.time_end}Z`).toDate());
      this.durationUpdate();
    }
  }

  /**
   * Calcula la duración del periodo
   */
  durationUpdate() {
    this._duration = !moment(this.date_start).isSame(this.date_end) ? moment(this.date_end).diff(this.date_start, 'seconds') : 0;
  }

  /**
   * Añade un nuevo registro de tiempo
   * @param time hora a establecer en formato hh:mm
   * @param field campo a modificar
   */
  addTime(time: string | Date, field: 'start' | 'end') {
    const realField = `date_${field}`;
    if (time instanceof Date) {
      this[realField] = time;
    } else {
      if (!/\d\d:\d\d/.test(time as string)) {
        throw new Error('El formato de hora no es el adecuado');
      }
      this[realField] = DateWithoutOffset(moment(`${moment(this[realField]).format('YYYY-MM-DD')}T${time}:00Z`).toDate());
    }
    this.durationUpdate();
  }

  /**
   * Exporta a objeto plano y formateado los datos de esta clase
   * @returns objeto plano
   */
  export(): object {
    const toReturn = super.export();
    delete (toReturn.status);
    toReturn.name = toReturn.description;
    return toReturn;
  }

  /**
   * Clona el objeto
   */
  clone(): Imputation {
    return this.copy(this);
  }

  get mod(): Modules {
    return this._mod;
  }

  set mod(newModule: Modules) {
    console.warn('No se puede actualizar el modulo de una imputacion');
  }

  get duration(): number {
    return this._duration;
  }
}
