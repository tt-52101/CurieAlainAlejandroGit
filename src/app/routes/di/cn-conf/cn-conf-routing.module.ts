import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CnConfComponent } from './cn-conf.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: CnConfComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class CnConfRoutingModule { }