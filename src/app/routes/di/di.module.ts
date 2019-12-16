import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { DiRoutingModule } from './di-routing.module';
import { DiConnectionsComponent } from './connections/connections.component';
import { DiConnectionsEditComponent } from './connections/edit/edit.component';
import { DiConnectionsViewComponent } from './connections/view/view.component';
import { DiConnectionsLogComponent } from './connections/log/log.component';
import { DiConnectionsCreateComponent } from './connections/create/create.component';
import { CnConfModule } from './cn-conf/cn-conf.module';
import { PdiModule } from './pdi/pdi.module';

const COMPONENTS = [
  DiConnectionsComponent,
];
const COMPONENTS_NOROUNT = [
  DiConnectionsEditComponent,
  DiConnectionsViewComponent,
  DiConnectionsLogComponent,
  DiConnectionsCreateComponent];

@NgModule({
  imports: [
    SharedModule,
    DiRoutingModule,
    CnConfModule,
    PdiModule,
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class DiModule { }
