/**
 *
 * Obtiene una fecha con hora desde una fecha base y un horario
 * @param time hora en formato hh:mm
 * @param date fecha en ms o bien un string válido
 * @returns fecha actualizada con la hora
 */
export const getDateByTime = (time: string, date: number | string): Date => {
  const timesplit = time.split(':').map(e => +e);
  const updatedDate = new Date(date);
  updatedDate.setHours(timesplit[0]);
  updatedDate.setMinutes(timesplit[1]);
  return updatedDate;
};

/**
 * Convierte la fecha del formato crm al formato js
 * @param crmdate string con la fecha del crm
 * @return Fecha convertida
 */
export const crmDateToDate = (crmdate: string): Date => new Date(crmdate.concat('T00:00:00.000Z'));

/**
 * Convierte la fecha del formato js al formato crm
 * @param date Objeto date con la fecha de js
 * @returns Fecha convertida
 */
export const DateToCrmDate = (date: Date): string => {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};


/**
 * Elimna las horas de offset de una fecha
 * @param date fecha original
 * @returns fecha utc
 */
export const DateWithoutOffset = (date: Date): Date => {
  const offset: number = date.getTimezoneOffset() * 60000;
  const realDate: Date = new Date(date.getTime() + offset);
  return realDate;
}

/**
 * Convierte segundos decimales en tiempo sexagesimal
 * @param seconds cantidad de segundos
 * @returns tiempo en formate 00:00:00
 */
export const decimalToSexagesimal = (seconds: number): string => {
  const time = {
    hours: null,
    minutes: null,
    seconds: null,
  }
  let timeString: string = null;
  if (seconds !== undefined) {
    time.minutes = seconds / 60;
    time.seconds = seconds % 60;
    time.hours = time.minutes / 60;
    time.minutes = time.minutes % 60;
    timeString = Object.values(time).map(e => e.toString().split('.')[0].padStart(2, '0')).join(':');
  }
  return timeString;
}


export const spanishMonths: string[] = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
];

export const spanishDays: string[] = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes'
];


export const defaultConfigDatePickers = {
  lang: {
    placeholder: 'Select date',
    rangePlaceholder: ['Start date', 'End date'],
    today: 'Hoy',
    now: 'Ahora',
    backToToday: 'Back to today',
    ok: 'Ok',
    clear: 'Clear',
    month: 'Month',
    year: 'Year',
    timeSelect: 'Select time',
    dateSelect: 'Select date',
    monthSelect: 'Choose a month',
    yearSelect: 'Choose a year',
    decadeSelect: 'Choose a decade',
    yearFormat: 'YYYY',
    dateFormat: 'DD-MM-YYYY',
    dayFormat: 'D',
    weekFormat: 'DD-MM-YYYY',
    dateTimeFormat: 'M/D/YYYY HH:mm:ss',
    monthFormat: 'MMMM',
    monthBeforeYear: true,
    previousMonth: 'Previous month (PageUp)',
    nextMonth: 'Next month (PageDown)',
    previousYear: 'Last year (Control + left)',
    nextYear: 'Next year (Control + right)',
    previousDecade: 'Last decade',
    nextDecade: 'Next decade',
    previousCentury: 'Last century',
    nextCentury: 'Next century'
  },
  timePickerLocale: {
    placeholder: 'Select time'
  },
  dateFormat: 'YYYY-MM-DD',
  dateTimeFormat: 'YYYY-MM-DD HH:mm:ss',
  weekFormat: 'DD-MM-YYYY',
  monthFormat: 'YYYY-MM'
}