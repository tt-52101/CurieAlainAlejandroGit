import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core'
import { NzMessageService, UploadFile } from 'ng-zorro-antd'
import { SFComponent, SFSchema } from '@delon/form'
import { _HttpClient } from '@delon/theme'
import { ActivatedRoute } from '@angular/router'
import { DriveService } from '@core/services/drive.service'
import { SpinerFactoryService } from '@core'

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.less']
})
export class FilesComponent implements OnInit {

  showType: 'big' | 'small' = 'big';
  s: any = { orderby: 0, ps: 20, pi: 1, q: '' };
  loading = false;
  // list: any[] = [];
  item: any;
  path: any[] = [];
  total = 0;

  @ViewChild("sfMoveElement") sfMoveElement: SFComponent;

  @Input()
  params: any;

  @Input()
  actions: TemplateRef<any>;

  @Input()
  multiple: boolean | number = false;

  @Input('folders')
  folders: any;

  @Input('list') list: any;

  @Output()
  selected = new EventEmitter<any>();

  @Output()
  onNavigate = new EventEmitter<any>();

  data = { service: '', email: '', folderId: '', token: '' }

  actualFolder = { label: 'Actual', value: 'root' };
  actualFile = '';
  createFileModal = false;
  createFileSchema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: 'Nombre '
      },
      mimeType: {
        type: 'string',
        title: 'Tipo de archivo ',
        enum: [
          { label: 'Carpeta', value: 'application/vnd.google-apps.folder' },
          { label: 'Documento de texto', value: 'application/vnd.google-apps.document' },
          { label: 'Hoja de cálculo', value: 'application/vnd.google-apps.spreadsheet' },
          { label: 'Presentación', value: 'application/vnd.google-apps.presentation' }
        ],
      }
    },
    required: ['name', 'mimeType']
  }
  moveFileSchema: SFSchema = {
    properties: {
      async: {
        type: 'string',
        title: 'Async',
        enum: undefined,
        ui: {
          widget: 'tree-select',
          // expandChange: (e) => this.drive.getFiles(this.data, e.node.key).pipe(filter(el => el["mimeType"] === 'application/vnd.google-apps.folder'),
          //   map((res) => res.map((el) => {
          //     return {
          //       key: el.id,
          //       title: el.name,
          //       mimeType: el.mimeType
          //     }
          //   }))
          // ),
        },
      },
    },
  }
  permissionSchema: SFSchema = {
    properties: {
      type: {
        type: 'string',
        title: 'Tipo',
        enum: [
          { label: 'Usuario', value: 'user' },
          { label: 'Grupo', value: 'group' },
          { label: 'Dominio', value: 'domain' },
          { label: 'Cualquiera', value: 'anyone' }
        ]
      },
      rol: {
        type: 'string',
        title: 'Rol',
        enum: [
          { label: 'Poseedor', value: 'owner' },
          { label: 'Organizador', value: 'fileOrganizer' },
          { label: 'Permisos de escritura', value: 'writer' },
          { label: 'Añadir comentarios', value: 'commenter' },
          { label: 'Permisos de lectura', value: 'reader' }
        ]
      },
      email: {
        type: 'string',
        title: 'Email'
      }
    },
    required: ['type', 'rol', 'email']
  }

  renameModel = false;
  renameTitle = '';
  moveModel = false;
  moveId = '';
  folderNodes: any[] = [];
  permissionModel = false;


  constructor(
    public http: _HttpClient,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private msg: NzMessageService,
    private drive: DriveService,
    private spiner: SpinerFactoryService
  ) { }

  async ngOnInit() {
    this.spiner.show();
    this.drive.emitter.subscribe( res => {
        this.spiner.hide();
        this.list = res;
      console.log("Actualizando lista ===>", this.folders);
    })
    this.activatedRoute.queryParams.subscribe(params => {
      this.data = {
        service: params['service'],
        email: params['mail'],
        folderId: params['folderId'] || '1v2DT3rJG0ronLlMSuElR8AedyBFF-kWd',
        token: ''
      }
      if(params["token"] && params["service"] === 'drive'){
          this.drive.getDriveToken(params["token"]).subscribe( (result) => {
          this.data.token = JSON.parse(result.result.token);
          this.path.push({ name: 'Home', id: this.data.folderId });
          this.getData();
        });
      }
      else {
        this.getData();
      }
    });
  }

  private get parent_id() {
    return this.path[this.path.length - 1];
  }


  objectify(key, value) {
    return {
      [key]: value
    }
  }

  async getData() {
    console.log(this.data);
    switch (this.data.service) {
      case 'drive':
        this.list = this.drive.list
        // this.spiner.hide();
        break;
      // case 'dropbox':
      //   this.list = await this.dropbox.getFiles(this.data).toPromise();
      //   break;
      // case 'crm':
      //   this.list = await this.crm.getFiles(this.data).toPromise();
      //   break;
      // case 'alfresco':
      //   this.list = await this.alfresco.getFiles(this.data).toPromise();
      //   break;
      default:
        this.list = [];
        break;
    }
  }

  getCode(mp: string, type: 'link' | 'code') {
    return type === 'link' ? mp : `<img src="${mp}">`;
  }

  // #region op

  back() {
    this.path.pop();
    this.selected.emit(this.path[this.path.length - 1].id)
    this.load();
  }

  next(i: any) {
    let aux = {
      name: '',
      id: ''
    }
    aux.name = i.name;
    aux.id = i.id;
    this.path.push(aux);
    this.load();
  }

  load(node?: any) {
    this.spiner.show();
    if (node) {
      this.drive.getFiles(this.data, node.key);
    }
    else {
      this.drive.getFiles(this.data, this.path[this.path.length - 1].id)
    }
  }

  open(i: any) {
    if (i.mimeType === 'application/vnd.google-apps.folder') {
      this.selected.emit(i.key);
      this.next(i);
    }
    else {
      this.openFile(i.id, i.mimeType);
    }
  }

  openPath(path: any) {
    while (this.path[this.path.length - 1].name !== path.name) {
      this.path.pop();
    }
    this.load();
  }

  uploadData = () => {
    return {
      parent_id: this.parent_id,
    };
  }

  uploadChange({ file }: { file: UploadFile }) {
    if (file.status === 'done') {
      this.load();
    }
  }


  rename(i: any) {
    this.renameModel = true;
    this.item = i;
    this.renameTitle = i.title;
  }

  renameOk() {
    let newName = document.getElementsByName('renameTitle')[0]['value'];

    this.drive.renameFile(this.item.id, newName, this.data).toPromise().then(
      (res) => {
        if (res['message']['id']) {
          this.msg.success('Success');
          this.item.title = this.renameTitle;
          this.renameModel = false;
          this.cdr.detectChanges();
          this.load();
        }
        else {
          this.msg.error('There was an error...');
          this.item.title = this.renameTitle;
          // this.renameModel = false;
          this.cdr.detectChanges();
          this.onNavigate.emit({files: this.list, path: this.path});
        }
      });
  }

  // #endregion

  // #region move



  move(i: any) {
    console.log(i);

    let mappedFolders = this.folders.map(el => {
      return {
        key: el.id,
        title: el.name,
      }
    });

    console.log(mappedFolders);

    this.moveFileSchema.properties.async.enum = mappedFolders;
    this.sfMoveElement.refreshSchema();

    this.moveModel = true;
    this.actualFile = i.id;
    // this.item = i;
    // this.moveId = i.parent_id;
    // this.http.get(`/file/folder`).subscribe((res: any[]) => {
    //   res.splice(0, 0, { id: 0, title: '根目录' });
    //   this.folderNodes = this.arrSrv.arrToTree(res, {
    //     cb: item => {
    //       item.key = item.id;
    //       if (item.id === this.moveId) {
    //         item.disabled = true;
    //       }
    //     },
    //   });
    //   this.cdr.detectChanges();
    //   this.onNavigate.emit(this.list);
    // });
  }

  moveOk(e) {
    console.log(e);
    console.log(this.actualFile)
    console.log(this.actualFolder);
    this.drive.moveFile(this.data, this.actualFile, e.async, this.actualFolder.value).subscribe( (res) => {
      console.log(res);
    });

  }

  // #endregion

  // #region remove

  remove(id: number) {
    this.drive.deleteFile(id, this.data).toPromise().then((res: any) => {
      // this.spiner.hide();
      // this.list.splice(idx, 1);
      // this.cdr.detectChanges();
      this.load();
      this.onNavigate.emit(this.list);
    });
  }

  // #endregion

  createFile($event) {
    // this.spiner.show();
    this.createFileModal = false;
    console.log($event)
    // $event.folderId = this.actualFolder.value;

    switch (this.data.service) {
      case 'drive':
        this.drive.addItem({ name: $event.name, mimeType: $event.mimeType, folderId: this.path[this.path.length - 1].id }, this.data).toPromise().then((res) => {
          if (res['message']) {
            this.msg.success('Archivo creado');
            // this.moveModel = false;
            this.load();
          } else {
            this.msg.error('Hubo un error');
          }
          // this.spiner.hide();
        });
        break;
      // case 'crm':
      //   this.crm.addItem($event).toPromise().then((res) => {
      //     if (res['message']) {
      //       this.msg.success('Archivo creado');
      //     } else {
      //       this.msg.error('Hubo un error');
      //     }
      //   });
      //   break;
      case 'dropbox':
        break;
      case 'alfresco':
        break;
    }
  }


  openPermissionChange(i) {
    this.actualFile = i.id;
    this.permissionModel = true;
  }

  changePermissions($event) {
    $event.fileId = this.actualFile;

    this.drive.changePermissions($event, this.data, this.path[this.path.length - 1].id).toPromise().then((res) => {
      if (res['status'] === 200) {
        this.permissionModel = false;
        this.msg.success('Permisos cambiados');
      } else {
        this.permissionModel = false;
        this.msg.error(res['message']);
      }
    });
  }

  openFile(id: string, mimeType: string) {

    let gurl = 'https://docs.google.com/';

    switch (mimeType) {
      case 'application/vnd.google-apps.document':
        gurl = gurl + 'document/d/' + id;
        break;
      case 'application/vnd.google-apps.spreadsheet':
        gurl = gurl + 'spreadsheets/d/' + id;
        break;
      case 'application/vnd.google-apps.presentation':
        gurl = gurl + 'presentation/d/' + id;
        break;
      case 'application/vnd.google-apps.folder':
        gurl = gurl + 'drive/folders/' + id;
        break;
      default:
        gurl = gurl + 'drive/my-drive?' + 'ogsrc=32';
        break;
    }

    window.open(gurl);
  }

  cancel() {
    this.moveModel = false;
  }

}
