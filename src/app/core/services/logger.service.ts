import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  debug = false;
  constructor() { }

  /**
   * Loggea un mensaje en la consola
   * @param type tipo de mensaje
   * @param message mensaje a loggear
   */
  log(type: 'log' | 'warning' | 'error', ...params: any[]) {
    if (this.debug) {
      console[type](params);
    }
  }
}
