import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { map } from 'rxjs/operators';
// fix para el script de instalacion antiguo que sobreescribe el fichero de app-settings


/** ---------------------------------------------------
Servicio para obtener los modulos y campos de cada modulo
---------------------------------------------------- */
@Injectable({
  providedIn: 'root'
})
export class ModulosService {

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
  getToken() {
    this.resetHeaders();
    const body = {
      "userName": "ItopConsulting",
      "password": "ItopAdmin19$",
      "params": {}
    };
    console.log(this.headers);
    return this.net.post(environment.baseurl + '/Users/Login', body, { headers: this.headers });
  }
  /** ---------------------------------------------------
          Función para obtener TODOS los modulos
  ---------------------------------------------------- */
  getModules(token) {
    this.resetHeaders();
    this.headers = this.headers.append('x-token', token);

    return this.net.get(environment.baseurl + '/Users/ModuleList', { headers: this.headers }).pipe(map(obj => {
      obj = this.convertToValueLabel(obj, "name", "label");
      console.log(obj);
      return obj;
    }))
  }

  /** ---------------------------------------------------------------
  Función para obtener campos en función del modulo al que pertenece
  ------------------------------------------------------------------- */
  getModuleFields(modulo_: any, token) {
    this.resetHeaders();

    const body = {
      'modulo': modulo_,
    };

    this.headers = this.headers.append('x-token', token);

    return this.net.post(environment.baseurl + '/Users/ModuleFields', body, { headers: this.headers }).pipe(map(obj => {
      obj = this.convertToFieldSchema(obj, "id", "label", "type", "options");
      console.log(obj);
      return obj;
    }))
  }

  getEmailTemplates(token) {
    this.resetHeaders();
    this.headers = this.headers.append('x-token', token);

    return this.net.get(environment.baseurl + '/EmailTemplates/GetTemplates', { headers: this.headers }).pipe(map(obj => {
      obj = this.convertToValueLabel(obj, "id", "name");
      console.log(obj);
      return obj;
    }))

  }

  getModulosCampos(token) {
    this.resetHeaders();
    this.headers = this.headers.append('x-token', token);
    return this.net.get(environment.baseurl + '/IFormularios/GetForm?id=85245', { headers: this.headers });
  }

  getSegments(token) {
    this.resetHeaders();
    this.headers = this.headers.append('x-token', token);
    return this.net.get(environment.baseurl + '/ISegmentos/GetSegments', { headers: this.headers });
  }

  convertToValueLabel(obj, key1, key2) {
    obj = obj["result"];
    const output = [];
    const keys = Object.keys(obj);
    keys.forEach(key => {
      const aux = {
        value: undefined,
        label: undefined
      }
      aux.value = obj[key][key1].toString();
      aux.label = obj[key][key2].toString();
      output.push(aux);
    });
    return output
  }

  parseOptions(obj) {
    const output = [];
    let aux = {
      value: undefined,
      label: undefined
    }
    const keys = Object.keys(obj);
    keys.forEach(key => {
      aux = {
        value: undefined,
        label: undefined
      }
      aux.value = key;
      aux.label = obj[key].toString();
      output.push(aux);
    });
    return output;
  }

  convertToFieldSchema(obj, key1, key2, key3, key4?) {
    obj = obj["result"];
    const output = [];
    const keys = Object.keys(obj);
    keys.forEach(key => {
      const aux = {
        value: undefined,
        label: undefined,
        type: undefined,
        options: undefined
      }
      aux.value = obj[key][key1].toString();
      aux.label = obj[key][key2].toString();
      aux.type = obj[key][key3].toString();
      if (obj[key][key3] === "select") {
        aux.options = this.parseOptions(obj[key][key4]);
      }

      output.push(aux);
    });
    return output
  }

  objectToArray(main: object): object[] {
    return Object.keys(main).map(e => {
      const toReturn = { ...main[e] };
      if (e['id'] === undefined) {
        toReturn['id'] = +e;
      }
      return toReturn;
    });
  }
}
