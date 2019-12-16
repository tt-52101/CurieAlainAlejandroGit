import { DiConnectionsViewComponent } from './connections/view/view.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DiConnectionsComponent } from './connections/connections.component';
import { PdiComponent } from './pdi/pdi.component';
import { CnConfComponent } from './cn-conf/cn-conf.component';

const routes: Routes = [
  { path: 'connections', component: DiConnectionsComponent },
  { path: 'connections/view/:id', component: DiConnectionsViewComponent },
  { path: 'pdi', component: PdiComponent },
  { path: 'connectionConf', component: CnConfComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiRoutingModule { }
