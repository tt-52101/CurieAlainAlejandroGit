import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { CmsService } from '@core/services/cms.service';
import { I18NService } from '@core/i18n/i18n.service';

@Component({
  selector: 'app-deployment',
  templateUrl: './deployment.component.html',
  styleUrls: ['./deployment.component.less']
})
export class DeploymentComponent implements OnInit {

  avatar = '';
  userLoading = true;
  user: any;
  param = {};

  // ESQUEMA FORMULARIO
  schema = {
    properties: {
      dominio: {
        type: 'string',
        title: 'Dominio',
        maxLength: 50,
        description: 'The name of your site',
        ui: {
          type: 'url',
          placeholder: 'www.tudominio.com',
          validator: (value: any) => { return }
        }
      },
      nombre: {
        type: 'string',
        title: 'Nombre',
        maxLength: 50,
        description: 'Nombre del usuario administrador para el sitio',
        ui: {
          placeholder: 'Nombre',
          validator: (value: any) => { return }
        }
      },
      password: {
        type: 'string',
        title: 'Contraseña',
        maxLength: 50,
        description: 'Contraseña de ususario administrador para el sitio',
        ui: {
          placeholder: 'Contraseña',
          type: 'password',
          validator: (value: any) => { return }
        }
      },
    },

    required: ['dominio', 'dns', 'nombre', 'password']
  }

  constructor(private i18n: I18NService, private http: _HttpClient, private cmsservice: CmsService, private cdr: ChangeDetectorRef, private msg: NzMessageService) { }

  ngOnInit() {
  }

  save(event) {
    this.param = event;
    this.cmsservice.activateGhost(this.param).subscribe((res) => {
      console.log(`${res['statusCode']}: ${res['body'].message}`);
    }, (error) => {
      console.error(`There was an error: ${error}`);
    });
  }
}
