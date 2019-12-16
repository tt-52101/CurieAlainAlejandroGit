import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';

const API_URL = 'http://localhost:3000/api';

//const API_URL = environment.domain;

@Injectable({
  providedIn: 'root'
})
export class PdiService {

  constructor(private http: HttpClient) { }

  ngOnInit() { }

  /**
   * Set HTTP common headers for HTTP calls
   */
  setHeaders() {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    return headers;
  }

  /**
   * Llamada API para listar KTRs.
   */
  getListKtr() {
    return this.http.get(API_URL + '/pdi/getFiles', { headers: this.setHeaders() });
  }

  /**
  * Llamada API para listar templates KTRs.
  */
  getTemplatesKtr() {
    return this.http.get(API_URL + '/pdi/getTemplates', { headers: this.setHeaders() });
  }

  /**
   * Llamada API para editar el archivo KTR seleccionado.
   * @param data 
   */
  editSpecificKtr(data) {
    return this.http.post(API_URL + '/pdi/editConnection', { data }, { headers: this.setHeaders() });
  }

  /**
   * Llamada API para ejecutar el KTR que encripta las contraseñas nuevas ingresadas.
   */
  executeTransform() {
    return this.http.get(API_URL + '/pdi/executeTransform', { headers: this.setHeaders() });
  }

  /**
   * Llamada API que le indica a Kubernetes que cree un CronJob y ejecute dicho CronJob en el momento que le hemos indicado.
   */
  executeCronJob(data: any) {
    return this.http.post(API_URL + '/pdi/cronjob', { data }, { headers: this.setHeaders() });
  }

  statusCronJob(data: any) {
    return this.http.get(API_URL + '/pdi/cronstatus', { headers: this.setHeaders(), params: data })
  }
  /**
   * Call to endpoint to create connection
   * @param data 
   */
  createConnection(data: any, template: any) {
    return this.http.post(API_URL + '/pdi/createConnection', { data, template }, { headers: this.setHeaders() });
  }

  /**
   * Call to endpoint to delete conection
   * @param data 
   */
  deleteConnection(data: any) {
    return this.http.delete(API_URL + '/pdi/deleteConnection', { headers: this.setHeaders() });
  }

  json() {
    return this.http.post(API_URL + '/pdi/json', { headers: this.setHeaders() });
  }

  /* 
    getToken() {
      return this.http.post(API_URL + '/pdi/token', { headers: this.setHeaders() });
    }
  
    
    getIframe() {
      return this.http.get(API_URL + '/pdi/iframe', { headers: this.setHeaders() });
    } */
}
