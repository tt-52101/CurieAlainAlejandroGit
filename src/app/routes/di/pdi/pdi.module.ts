import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { PdiComponent } from './pdi.component';


const COMPONENTS = [PdiComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT,
  providers:[
  ]
})
export class PdiModule { }
