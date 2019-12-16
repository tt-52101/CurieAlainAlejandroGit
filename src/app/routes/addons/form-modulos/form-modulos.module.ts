import { FormModulosComponent } from './form-modulos.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { FormModulosRoutingModule } from './form-modulos-routing.module';

import { NgZorroAntdModule, NZ_ICONS } from 'ng-zorro-antd';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])

const COMPONENTS = [FormModulosComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    FormModulosRoutingModule,
    NgZorroAntdModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT,
  providers:[
    { provide: NZ_ICONS, useValue: icons }
  ]
})
export class FormModulosModule { }
