import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators'
import { Folder } from '../../routes/addons/file-manager/models/Folder';
import { File } from '../../routes/addons/file-manager/models/File';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class CrmfilesService {

  url = environment.baseurl;
  public headers = new HttpHeaders({
    'x-api-key': 'eC45KxcBcv7dbdK7hncNz48wrK0eQTaXV0nTYmnthzjKbx36QnKH8d6q13dqC3fM',
    // 'x-token': '',
    'Authorization': `Basic ${btoa('Itopdemo' + ':' + 'Passw0rd')}`
  });

  constructor(
    private http: HttpClient,
  ) { }

  getContent(userToken: any, token: any ): Observable<any> {
    // this.headers.append("x-token", token)
    let files: Array<any>;
    return this.http.get(`${this.url}/Documents/Documents/`, { headers: this.headers })
      .pipe(map(e => {
        console.log(e);
        let files = [];
        console.log( Object.keys(e["result"]))
        Object.keys(e["result"]).forEach(key => {
          files.push(e["result"][key][0]);
        });
        return files;
      }));
  }

  getFiles(userToken: any, token: any): Observable<File[]> {
    this.headers.append("x-token", token)
    return this.http.get(`${this.url}/Documents/Documents/`, { headers: this.headers })
      .pipe(map(e => {
        // your code here
        // return folder[]
        return e['result'];
      }));
  }

  addItem(formData: object): Observable<any> {
    return this.http.post(`${this.url}`, formData, { headers: this.headers })
      .pipe(map(e => {
        // your code here
        // return folder[]
        return e['result'];
      }));
  }

  renameItem(formData: object): Observable<any> {
    return this.http.post(`${this.url}`, formData, { headers: this.headers })
      .pipe(map(e => {
        // your code here
        // return folder[]
        return e['result'];
      }));
  }

  removeItem(formData: object): Observable<any> {
    return this.http.post(`${this.url}`, formData, { headers: this.headers })
      .pipe(map(e => {
        // your code here
        // return folder[]
        return e['result'];
      }));
  }

  setProperties(e: any) {
    let properties = ['title']; // antes solo title y childrn
    console.log('eeeeee =>', e)
    // e['result'] = e['result'].filter(e => e.mimeType === '');
    let files: Array<any>;
    if (e['result'].length > 0) {
      for (let i = 0; i < properties.length; i++) {
        e['result'].forEach(element => {
          // Object.defineProperty(element, properties[i], {
          //   value: element.name,
          //   enumerable: true,
          //   writable: true,
          //   configurable: true
          // });
          files.push(element[0])
        });
      }
    } else {
      e['result'] = [];
    }

    return files;
  }

}
