import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormModulosComponent } from './form-modulos.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', component: FormModulosComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class FormModulosRoutingModule { }
