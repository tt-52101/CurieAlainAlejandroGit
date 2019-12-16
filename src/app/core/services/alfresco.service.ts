import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { Folder } from '../../routes/addons/file-manager/models/Folder';
import { File } from '../../routes/addons/file-manager/models/File';

@Injectable({
  providedIn: 'root'
})
export class AlfrescoService {

  headers = new HttpHeaders();

  constructor(
    private http: HttpClient
  ) { }

  getContent(data: any): Observable<Folder[]> {
    return this.http.get(``, { headers: this.headers })
      .pipe(
        map(res => {
          // your code here
          // return folder[]
          return null;
        })
      );
  }

  getFiles(data: any): Observable<File[]> {
    return this.http.get(``, { headers: this.headers })
      .pipe(
        map(e => {
          // your code here
          // return folder[]
          return e[''];
        })
      );
  }

}
