import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { v4 } from 'uuid';
import { FileElement } from '../../routes/addons/file-manager/models/FileElement';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private map = new Map<string, FileElement>();
  private querySubject: BehaviorSubject<FileElement[]>;
  //private url = environment.domain + '/api/drive';
  private url = `${environment.domain}/api/drive/`;

  constructor(
    private http: HttpClient
  ) { }

  /**
  * Receive a parent id to compare a search for posible fails
  * @param parent
  */
  checkParent(parent) {
    if (parent === undefined) {
      return "root"
    } else if (parent === "") {
      return;
    } else {
      return parent[0];
    }
  }

  /**
   * Receive a mimeType and give a boolean to know what kind of file is
   * @param mimeType
   */
  checkMime(mimeType: string) {
    if (mimeType === "application/vnd.google-apps.folder") {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Take the data of the query and filter it by parent and mimeType to list only the correct files
   * @param filesData
   */
  workData(filesData) {
    // let data = JSON.parse(filesData._body);
    console.log("Filesdata ==>",filesData)
    const data = filesData.message

    // let filesArray = data.message;
    const filesArray = data;
    const modifiedList = [];

    for (let i = 0; i < filesArray.length; i++) {
      if (filesArray[i].mimeType === "application/vnd.google-apps.folder") {
        modifiedList.push(this.add({ id: filesArray[i].id, name: filesArray[i].name, isFolder: this.checkMime(filesArray[i].mimeType), parent: this.checkParent(filesArray[i].parents), type: 'folder', children: [] }));
      }
    }

    return modifiedList;
  }

  /**
   *
   * @param filesArray
   */
  workTreeData(filesArray) {

    const modifiedList = [];

    for (let i = 0; i < filesArray.length; i++) {
      if (filesArray[i].expandable === true) {
        modifiedList.push(this.add({ id: filesArray[i].id, name: filesArray[i].item, isFolder: true, parent: "", type: 'folder', children: [], item: filesArray[i].item, level: filesArray[i].level, expandable: filesArray[i].expandable, isLoading: filesArray[i].isLoading }));
      }
    }

    return modifiedList;
  }

  /**
   * Manage the files and return the parent folder's id
   * @param folders
   */
  workRootFolderId(folders) {
    // let data = JSON.parse(folders._body);
    // let dataMessage = data.message;
    const dataMessage = folders.message;
    return dataMessage[0].parents[0]
  }

  add(fileElement: FileElement) {
    fileElement.id = v4();
    this.map.set(fileElement.id, this.clone(fileElement));
    return fileElement;
  }

  delete(id: string) {
    this.map.delete(id);
  }

  update(id: string, update: Partial<FileElement>) {
    let element = this.map.get(id);
    element = Object.assign(element, update);
    this.map.set(element.id, element);
  }

  queryInFolder(folderId: string) {
    const result: FileElement[] = [];
    this.map.forEach(element => {
      if (element.parent === folderId) {
        result.push(this.clone(element));
      }
    });
    if (!this.querySubject) {
      this.querySubject = new BehaviorSubject(result);
    } else {
      this.querySubject.next(result);
    }
    return this.querySubject.asObservable();
  }

  get(id: string) {
    return this.map.get(id);
  }

  clone(element: FileElement) {
    return JSON.parse(JSON.stringify(element));
  }
}
