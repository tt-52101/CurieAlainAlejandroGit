import { NgModule } from '@angular/core'
import { SharedModule } from '@shared'

import { AddonsRoutingModule } from './addons-routing.module';

const COMPONENTS = [];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    AddonsRoutingModule,
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
  ],
  providers: [],
  entryComponents: COMPONENTS_NOROUNT
})
export class AddonsModule { }
