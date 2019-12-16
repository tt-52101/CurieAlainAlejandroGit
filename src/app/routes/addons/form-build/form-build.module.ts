import { FormBuildComponent } from './form-build.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { FormBuildRoutingModule } from './form-build-routing.module';


const COMPONENTS = [FormBuildComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    FormBuildRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT,
  providers:[
  ]
})
export class FormBuildModule { }
