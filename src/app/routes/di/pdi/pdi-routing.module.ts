import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PdiComponent } from './pdi.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: PdiComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class PdiRoutingModule { }