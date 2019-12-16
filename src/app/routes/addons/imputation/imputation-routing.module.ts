import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImputationComponent } from './imputation.component';
import { AuthGuard } from '@shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '', pathMatch: 'full', component: ImputationComponent, canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImputationRoutingModule { }
