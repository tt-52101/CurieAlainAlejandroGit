import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormBuildComponent } from './form-build.component';
import { AuthGuard } from '@shared/guards/auth.guard';


const routes: Routes = [
  {
     path: '', 
     component: FormBuildComponent,
     canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class FormBuildRoutingModule { }
