import { Injectable, EventEmitter } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { environment } from '@env/environment'

import { Folder } from '../../routes/addons/file-manager/models/Folder'
import { File } from '../../routes/addons/file-manager/models/File'
import { NzTreeNode } from 'ng-zorro-antd'

@Injectable({
  providedIn: 'root',
})
export class DriveService {

  headers = new HttpHeaders();
  private url = `${environment.domain}/api/drive/`;

  emitter: EventEmitter<Folder[]> = new EventEmitter();
  treeEmitter : EventEmitter<Folder[]> = new EventEmitter();
  list: Folder[];
  actualFolder: NzTreeNode;

  constructor(private http: HttpClient) {}

  getAuthUrl() {
    return this.http.get(`${this.url}auth`, { headers: this.headers });
  }

  getFiles(data: any, id?: any, event?: any){
    this.http
      .post(
        `${this.url}getfilteredfiles`,
        { id: id || data.folderId, token: data.token },
        { headers: this.headers },
      ).toPromise().then( res => {
        this.list = res["message"];
        if(event === 'expand') {
          this.treeEmitter.emit(this.list);
        }
        else {
          this.emitter.emit(this.list);
        }
      }).catch( err => {
        console.log(err);
      })
  }


  addItem(formData: object, data: any) {
    return this.http
      .post(`${this.url}create`, { formData, token: data["token"] }, { headers: this.headers })
  }

  getClientId() {
    return this.http.get(`${this.url}getClientId`);
  }

  renameFile(id: string, name: string, data: any): Observable<any> {
    return this.http.post(`${this.url}renamefile`,
      {
        "id": id,
        "resource": {
          "name": name
        },
        token: data["token"]
      }, { headers: this.headers })
      .pipe(map(e => {
        return e;
      }));
  }

  deleteFile(id: number, data: any ): Observable<any> {
    return this.http.post(`${this.url}delete`,
      { "id": id, token: data["token"] }, { headers: this.headers })
      .pipe(map(e => {
        return e;
      }));
  }


  changePermissions(permissions: object, data: any, folderId): Observable<any> {
    return this.http.post(`${this.url}modifypermissions`,
      {permissions, token: data["token"], folderId: folderId}, { headers: this.headers })
      .pipe(map(e => {
        return e;
      }));
  }


  setProperties(e: any) {
    let properties = ['title']; // antes solo title y childrn
    if (e['message'].length > 0) {
      for (let i = 0; i < properties.length; i++) {
        e['message'].forEach(element => {
          Object.defineProperty(element, "title", {
            value: element.name,
            enumerable: true,
            writable: true,
            configurable: true,

          });
          Object.defineProperty(element, "key", {
            value: element.id,
            enumerable: true,
            writable: true,
            configurable: true,
          })
        });
      }
    } else {
      e['message'] = [];
    }
    this.list = e;
    return e;
  }

  setCredentials(credentials): Observable<any> {
    this.headers.append('Content-Type', 'application/json');
    return this.http.post(`${this.url}setcredentials`,
      { credentials }, { headers: this.headers })
      .pipe(map(e => {
        console.log(e);
        return e;
      }));
  }

  getDriveToken(userToken): Observable<any> {
    return this.http.get(`${environment.baseurl}/Users/DriveToken?token=${userToken}`, { headers: this.headers} );
  }

  moveFile(data: any, fileId: string ,parentId: string, previousParent: string): Observable<any> {
    return this.http.post(`${this.url}move`,
      {token: data["token"], fileId: fileId, parentId: parentId, previousParent: previousParent}, { headers: this.headers })
      .pipe(map(e => {
        return e;
      }));
  }


}
