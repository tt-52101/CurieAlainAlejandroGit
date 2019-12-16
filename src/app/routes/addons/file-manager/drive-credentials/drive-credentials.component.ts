import { Component, OnInit, Input } from '@angular/core';
import { SFSchema } from '@delon/form';
import { Router, ActivatedRoute } from '@angular/router';
import { FullContentService } from '@delon/abc';
import { NzMessageService } from 'ng-zorro-antd';
import { DriveService } from '@core/services/drive.service';

@Component({
  selector: 'app-drive-credentials',
  templateUrl: './drive-credentials.component.html',
  styleUrls: ['./drive-credentials.component.less']
})
export class DriveCredentialsComponent implements OnInit {

  data: any;
  icon = 'arrow_left';
  schema: SFSchema = {
    properties: {
      credentials: {
        type: 'string',
        title: 'Credentials'
      }
    },
    required: ['credentials']
  }

  constructor(
    private router: Router,
    private drive: DriveService,
    private msg: NzMessageService,
    private activateRoute: ActivatedRoute,
    private fullContentService: FullContentService
  ) { }

  ngOnInit() {
    this.fullContentService.toggle();
    this.activateRoute.queryParams.subscribe(params => {
      this.data = {
        service: params['service'],
        folderId: '1v2DT3rJG0ronLlMSuElR8AedyBFF-kWd',
      }
    });
  }

  submit(value: any) {
    let credentials = JSON.parse(value.credentials);

    if (credentials.length === 0) {
      this.msg.error('Incorrect data. Please send the data given by Google Drive');
    } else {
      this.drive.setCredentials(credentials).subscribe(result => {
        this.msg.success('Credenciales colocadas correctamente');
      }, (error) => {
        console.error(error.statusText);
        this.msg.error('There was an error...');
      });
    }
  }

  redirect() {
    switch (this.icon) {
      case 'settings':
        this.icon = 'arrow_left';
        this.router.navigateByUrl(`/addons/fileManager/Drivecredentials`);
        break;
      case 'arrow_left':
        this.icon = 'settings';
        this.router.navigateByUrl(`/addons/fileManager?dirId=${this.data.folderId}&service=${this.data.service}`);
        break;
    }
  }

  googleLogin() {
    this.drive.getClientId().subscribe((res) => {
      // console.log(res[0]);
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

}
