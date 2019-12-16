import { ConfigComponent } from './config.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { GeneralComponent } from './general/general.component';
import { DelonFormModule } from '@delon/form'; // Formularios
import { FormsModule } from '@angular/forms';
import { DeploymentComponent } from './deployment/deployment/deployment.component';


const COMPONENTS = [];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    DelonFormModule.forRoot()
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
    ConfigComponent,
    GeneralComponent,
    DeploymentComponent
  ],
  entryComponents: COMPONENTS_NOROUNT,
  providers:[
  ]
})
export class ConfigModule { }
