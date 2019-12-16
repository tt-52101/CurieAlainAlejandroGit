import { Component, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { FullContentService } from '@delon/abc'
import { NzFormatEmitEvent, NzTreeNode, NzTreeNodeOptions } from 'ng-zorro-antd'
import { CrmfilesService, LoginService, DriveService } from '@core'
import { environment } from '@env/environment'
import { BasicUser } from '@shared/typings/User'
import { map } from 'rxjs/operators'
import { Folder } from './models/Folder'

@Component({
  selector: 'app-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.less']
})
export class FileManagerComponent implements OnInit {

  @ViewChild('tree') folderTree;
  @ViewChild('file') fileManager;

  icon = 'settings';
  // folders: NzTreeNodeOptions[] = [{key: '1v2DT3rJG0ronLlMSuElR8AedyBFF-kWd', title: 'root', children: []}];
  folders: Folder[] = [{
    children: [],
    id: "",
    key: "home",
    mimeType: "application/vnd.google-apps.folder",
    name: "Home",
    permissions: [],
    title: "Home",
  }];
  // files: File[] = [];
  data = { service: '', email: '', folderId: '', token: '' }
  crmToken;
  updateFiles = false;

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private fullContentService: FullContentService,
    private drive: DriveService,
    private crm: CrmfilesService,
    private loginService: LoginService,
  ) { }

  async ngOnInit() {
    await this.fullContentService.toggle();

    this.activateRoute.queryParams.subscribe(params => {
      this.data = {
        service: params['service'],
        email: params['mail'],
        folderId: params['folderId'] || '1v2DT3rJG0ronLlMSuElR8AedyBFF-kWd',
        token: ''
      }
      this.crmToken = params["token"]

      if(params["token"] && params["service"] === 'drive'){
        this.drive.getDriveToken(params["token"]).subscribe( (result) => {
          this.data.token = JSON.parse(result.result.token);
          this.getData();
        });
      }
      else {
        this.getData();
      }
    });
  }

  async getData() {
    switch (this.data.service) {
      case 'drive':
        this.drive.actualFolder = this.folderTree.getTreeNodeByKey("home");
        this.drive.actualFolder.key = this.data.folderId;
        console.log(this.drive.actualFolder);

        this.drive.emitter.pipe(map((e: Folder[]) => e.map( (el: Folder) => {
          el.key = el.id;
          el.title = el.name;
          return el;
        }))).subscribe( res => {
          // if(this.folders[0].children.length === 0) {
          //   this.drive.actualFolder.addChildren(res);
          //   this.drive.actualFolder.setExpanded(true);
          //   this.drive.actualFolder.setSelected(true);
          // }
          // else {
            if(this.updateFiles){
              this.fileManager.list = res;
              this.updateFiles = false;
            }
            this.drive.actualFolder.clearChildren();
            this.drive.actualFolder.addChildren(res.filter((e:Folder) => e.mimeType === 'application/vnd.google-apps.folder'));
            this.drive.actualFolder.setExpanded(true);
            this.drive.actualFolder.setSelected(true);
          // }
          console.log("Actualizando lista ===>", this.folders);
        })

        this.drive.treeEmitter.pipe(map((e: Folder[]) => e.map( (el: Folder) => {
          el.key = el.id;
          el.title = el.name;
          return el;
        }))).subscribe( res => {
          if(this.updateFiles){
            this.fileManager.list = res;
            this.updateFiles = false;
          }
          this.drive.actualFolder.clearChildren();
          this.drive.actualFolder.addChildren(res.filter((e:Folder) => e.mimeType === 'application/vnd.google-apps.folder'));
          this.drive.actualFolder.setExpanded(true);
          this.drive.actualFolder.setSelected(true);
          console.log("Actualizando arbol ===>", this.folders);
        })

        this.drive.getFiles(this.data, this.data.folderId);

        break;
      case 'dropbox':
        // this.folders = await this.dropbox.getContent(this.data).toPromise();
        // this.files = await this.drive.getFiles(this.data).toPromise();
        break;
      case 'crm':
        const user: BasicUser = { userName: environment.auth.user, password: environment.auth.passwd };
        this.loginService.refreshLogin( this.crmToken ).subscribe(async (res) => {
          let token;
          token = res.result.token
          console.log(this.drive.headers);
          this.folders = await this.crm.getContent(this.crmToken, token).toPromise();
          console.log(this.folders)
        });
        break;
      case 'alfresco':
        // this.folders = await this.alfresco.getContent(this.data).toPromise();
        // this.files = await this.drive.getFiles(this.data).toPromise();
        break;
      default:
        this.folders = [];
        // this.files = [];
        break;
    }
  }

  googleLogin() {
    this.drive.getClientId().subscribe((res) => {
      let credentials = res[0].credentials;
      console.log(window);
      this.drive.getAuthUrl().subscribe((res) => {
        console.log(res);
        let authUrl = res["authUrl"];
        var popup = window.open(authUrl);
      });
    }, (err) => {
      console.log(err);
    });
  }

  async addNodeAsync(event: Required<NzFormatEmitEvent>) {
    this.drive.actualFolder = event.node;
    const id = event['node']['origin']['id'];
    this.drive.getFiles(this.data, id, event.eventName);
    if (event.eventName === 'click') {
      this.fileManager.spiner.show();
      this.updateFiles = true;
      let path: any;
      let aux = this.folderTree.getTreeNodeByKey(event.node.key);
      path = [];
      path.push({name: aux.origin.name , id: aux.origin.id });

      while(aux.parentNode !== null) {
        aux = aux.parentNode;
        path.push({name: aux.origin.name , id: aux.origin.id });
      }
      // path.push({name: 'Home', id: this.data.folderId});
      path = path.reverse();
      this.fileManager.path = path;
      this.fileManager.spinner.show();

    }


  }

  redirect() {
    this.router.navigateByUrl(`/addons/fileManager/DriveCredentials?dirId=${this.data.folderId}&service=${this.data.service}`);
  }

  getSelected(key: any) {
    this.drive.actualFolder = this.folderTree.getTreeNodeByKey(key);
    console.log(this.folderTree.getTreeNodeByKey(key))
  }
}
