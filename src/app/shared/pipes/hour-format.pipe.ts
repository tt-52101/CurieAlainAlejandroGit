import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'hourFormat'
})
export class HourFormatPipe implements PipeTransform {

  /**
   * Convert seconds in a hexadecimal number
   * @param seconds seconds amount
   */
  transform(seconds: number): any {
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

}
