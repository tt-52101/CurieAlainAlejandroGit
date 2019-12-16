import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { SFSchema } from '@delon/form';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralComponent implements OnInit {
  avatar = '';
  userLoading = true;
  user: any;
  param = {};


    // ESQUEMA FORMULARIO
    schema = {
      properties: {
        title: {
          type: 'string',
          title: 'Nombre',
          maxLength: 50,
          description: 'The name of your site',
        },
        description: {
          type: 'string',
          title: 'Descripción',
          description: 'Used in your theme, meta data and search results',
          ui: {
              widget: 'textarea',
              autosize: { minRows: 3, maxRows: 6 }
          }
        },
        icon:{
          type: 'string',
          title: 'Icono',
          description: 'At least 60x60px',
          ui: {
            widget: 'upload',
            action: '../../../../../assets/img_ghost',
            resReName: 'resource_id',
            text: 'Subir icono',
          },
          button: {

          }
        },
        logo:{
          type: 'string',
          title: 'Logo',
          description: 'Should be transparent and at least 600px x 72px',
          ui: {
            widget: 'upload',
            action: '../../../../../assets/img_ghost',
            resReName: 'resource_id',
            urlReName: 'url',
            text: 'Subir logo',
          }
        },
        cover_image:{
          type: 'string',
          title: 'Cover_Image',
          description: 'An optional large background image for your site',
          ui: {
            widget: 'upload',
            action: '/upload',
            resReName: 'resource_id',
            urlReName: 'url',
            text: 'Subir imagen de portada',
          }
        },
        facebook: {
          type: 'string',
          title: 'Facebook',
          maxLength: 50,
          // description: 'URL of your publications Facebook profile',
          ui: {
            type: 'url',
            placeholder: 'https://www.facebook.com/pepito'
          }
        },
        twitter: {
          type: 'string',
          title: 'Twitter',
          maxLength: 50,
          // description: 'URL of your publications Twitter profile',
          ui: {
            type: 'url',
            placeholder: 'https://twitter.com/pepito'
          }
        },
        
      },
      required: ['title','description']
      
    }

  constructor( private http: _HttpClient, private cdr: ChangeDetectorRef,private msg: NzMessageService) {}
  
  ngOnInit(): void {
  }


  save(event) {
   
    console.log('evento: ', event);
    this.param = event;
    console.log('Datos --> ', this.param);
    // this.msg.success(JSON.stringify(this.user));
    // return false;
  }



  

}
