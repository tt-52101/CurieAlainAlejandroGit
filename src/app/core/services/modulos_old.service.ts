import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

/** ---------------------------------------------------
Servicio para obtener los modulos y campos de cada modulo
---------------------------------------------------- */
@Injectable({
  providedIn: 'root'
})
export class ModulosOldService {

  public headers: HttpHeaders;

  constructor(private net: HttpClient) { }

  resetHeaders() {
    this.headers = new HttpHeaders();
    this.headers = this.headers.append('Authorization', `Basic ${btoa(`${environment.auth.user}:${environment.auth.passwd}`)}`);
    this.headers = this.headers.append('Content-Type', 'application/json');
    this.headers = this.headers.append('Accept', 'application/json');
    this.headers = this.headers.append('x-api-key', environment.apiKey);
  }

  /** ---------------------------------------------------
               Función para obtener el TOKEN
  ---------------------------------------------------- */
  get_token() {
    this.resetHeaders();
    const body = {
      "userName": "Itopdemo",
      "password": "Passw0rd",
      "params": {}
    };

    return this.net.post(environment.baseurl + '/Users/Login', body, { headers: this.headers });
  }
  /** ---------------------------------------------------
          Función para obtener TODOS los modulos
  ---------------------------------------------------- */
  get_modulos(token) {
    this.resetHeaders();
    this.headers = this.headers.append('x-token', token);
    return this.net.get(environment.baseurl + '/Users/ModuleList', { headers: this.headers });
  }

  /** ---------------------------------------------------------------
  Función para obtener campos en función del modulo al que pertenece
  ------------------------------------------------------------------- */
  get_campos_mod(modulo_: any, token) {
    this.resetHeaders();

    const body = {
      'modulo': modulo_,
    };

    this.headers = this.headers.append('x-token', token);

    return this.net.post(environment.baseurl + '/Users/ModuleFields', body, { headers: this.headers });
  }

  getEmailTemplates(token) {
    this.resetHeaders();
    this.headers = this.headers.append('x-token', token);

    return this.net.get(environment.baseurl + '/EmailTemplates/GetTemplates', { headers: this.headers });
  }

  getModulosCampos(modulo_: any, token) {
    this.resetHeaders();
    const body = {
      'modulo': modulo_,
    };
    this.headers = this.headers.append('x-token', token);
    return this.net.post(environment.baseurl + '/Users/ModuleFieldsForms', body, { headers: this.headers });
  }
}
