import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { CnConfComponent } from './cn-conf.component';

const COMPONENTS = [CnConfComponent];
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
export class CnConfModule { }
