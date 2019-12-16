import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { endPointExclusions, Modules } from '@shared/utils/modules.enum';
import { objectToArray } from '@shared/utils/objectsUtils';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { DateWithoutOffset } from '@shared/utils/dateUtils';

@Injectable({
  providedIn: 'root'
})
export class CrmService {

  constructor(private http: HttpClient) { }


  /**
   * Obtiene un listado del modulo especificado
   * @param {Modules} module modulo a consultar
   * @param {object} options objeto de configuracion
   * @param {object} options.params parametros con los que realizar la peticion
   * @param {Function} options.filterFunction function de filtrado
   */
  public getLists(module: Modules, options: { params?: object, filterFunction?: any } = {}): Observable<any[]> {
    const params = this.createUrlParams(options.params || {});
    const endPoint = this.correctEndPoint('get', module)
    return this.http.get(`${environment.baseurl}/${module}${endPoint.length > 0 ? `/${endPoint}` : endPoint}`, { params }).pipe(
      map((e: any) => {
        const toConvert = e.result.records === undefined ? e.result : e.result.records;
        let mappedObject = objectToArray(toConvert);
        if (options.filterFunction !== undefined) {
          mappedObject = mappedObject.filter(options.filterFunction);
        }
        return mappedObject;      
      })
    );
  }

  /**
   * Obtiene un registro de un modulo por su id
   * @param module modulo a consultar
   * @param id identificador del registro a buscar
   * @param options configuracion de la peticion
   * @param options.params parametros con los que realizar la peticion
   */
  public getById(module: Modules, id: string | number, options: { params?: object } = {}): Observable<any> {
    const params = this.createUrlParams(options.params || {});
    let endPoint = this.correctEndPoint('get', module);
    endPoint = endPoint === endPointExclusions.get.default ? `${module}/Record` : `${module}/${endPoint}`;
    return this.http.get(`${environment.baseurl}/${endPoint}/${id}`, { params }).pipe(
      map((e: any) => e.result.data)
    );
  }

  /**
   * Actualiza un registro por id del modulo especificado
   * @param module modulo del crm
   * @param id identificador del recurso
   * @param data datos actualizados
   */
  public updateRecord(module: Modules, id: string | number, data: object): Observable<any> {
    const endPoint = this.correctEndPoint('put', module);
    return this.http.put(`${environment.baseurl}/${module}/${endPoint}/${id}`, data);
  }

  /**
   * Elimina un registro por id del modulo especificado
   * @param module modulo del crm
   * @param id identificador de recurso
   * @param options configuraciones necesarias (parametros, cabeceras,...)
   */
  public removeRecord(module: Modules, id: string | number, options: { params?: object } = {}): Observable<any> {
    const endPoint = this.correctEndPoint('delete', module);
    let url = `${environment.baseurl}/${module}${endPoint.length > 0 ? '/'.concat(endPoint) : endPoint}`;
    const params: HttpParams = this.createUrlParams(options.params || {});
    const requestConfig: object = {};
    if (Object.values(options).length > 0) {
      requestConfig['params'] = params;
    } else {
      url = url.concat(`/${id}`);
    }
    return this.http.delete(url, requestConfig);
  }

  /**
   * Crea un nuevo registro en el crm
   * @param module modulo del crm
   * @param data datos a insertar
   */
  public createRecord(module: Modules, data: object): Observable<any> {
    const endPoint = this.correctEndPoint('post', module);
    return this.http.post(`${environment.baseurl}/${module}${endPoint.length > 1 ? `/${endPoint}` : endPoint}`, data);
  }

  /**
   * Modifica el endpoint en base al modulo
   * @param protocol protocolo sobre el que preguntar
   * @param module modulo a consultar
   */
  private correctEndPoint(protocol: 'get' | 'post' | 'put' | 'delete', module: Modules): string {
    return endPointExclusions[protocol][module] !== undefined ? endPointExclusions[protocol][module] : endPointExclusions[protocol].default;
  }

  /**
   * Generate query params object for http request
   * @param params plain object with params values
   * @return query params object
   */
  private createUrlParams(params: object) {
    let urlParams: HttpParams = new HttpParams();
    Object.keys(params).forEach(e => {
      let value: any[] | string = params[e];
      if (Array.isArray(value)) {
        value = `[${value.map(y => `"${y}"`)}]`;
      }
      urlParams = urlParams.set(e, value);
    });
    return urlParams;
  }

  /**
   * Guardar las imputaciones seleccionadas en la tabla
   * @param module Modulo al que atacar
   * @param records lista de registros afectados
   * @returns peticion ajax lista pata ejecucion
   */
  public createMany(module: Modules, records: any[]): Observable<any> {
    const body: object = { records };
    const endPoint = this.correctEndPoint('put', module);
    const url = `${environment.baseurl}/${module}${endPoint}`;
    return this.http.put(url, body);
  }

  /**
   * Elimina las imputaciones seleccionadas en la tabla
   * @param module modulo al que atacar
   * @param records lista de registros afectados
   * @returns peticion ajax lista pata ejecucion
   */
  public removeMany(module: Modules, records: any[]): Observable<any> {
    const body: object = { records };
    const endPoint = this.correctEndPoint('delete', module);
    const url = `${environment.baseurl}/${module}${endPoint}`;
    return this.http.request('delete', url, { body });
  }


  /**
   * Obtiene la hora actual del servidor
   * @returns observable con la hora del servidor
   */
  public getServerTime(): Observable<Date> {
    return this.http.get(`${environment.domain}/crm/servertime.php`, { responseType: 'text' }).pipe(
      map(res => DateWithoutOffset(new Date(res)))
    );
  }

  /**
   * Abre una nueva pestaña con la vista de detalles del recurso solicitado
   * @param mod modulo crm
   * @param id identificador del recurso
   * @param userid identificador de usuario
   * @param usertoken token personal
   */
  openDetails(mod: Modules, id: number, userid: number, usertoken: string) {
    window.open(`${environment.domain}/crm/index.php?module=${mod}&view=Detail&record=${id}&userid=${userid}&usertoken=${usertoken}`, '_target');
  }
}
