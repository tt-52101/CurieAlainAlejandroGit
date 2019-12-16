import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListStepperComponent } from './list-stepper/list-stepper.component';
import { TemplatesCodeComponent } from './templates-code/templates-code.component';
import { TemplatesLayoutComponent } from './templates-layout/templates-layout.component';
import { BuildLandingpageComponent } from './build-landingpage/build-landingpage.component'
import { AuthGuard } from '@shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ListStepperComponent,
    children: [
      { 
        path: '', 
        component: TemplatesLayoutComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'templates-layout',
        component: TemplatesLayoutComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'templates-code',
        component: TemplatesCodeComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'build',
    component: BuildLandingpageComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingPageRoutingModule {}
