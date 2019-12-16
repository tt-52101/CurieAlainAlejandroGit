import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListStepperComponent } from './list-stepper/list-stepper.component';
import { TemplatesNewsletterCodeComponent } from './templates-newsletter-code/templates-newsletter-code.component';
import { TemplatesNewsletterLayoutComponent } from './templates-newsletter-layout/templates-newsletter-layout.component';
import { AuthGuard } from '@shared/guards/auth.guard';
import { BuildNewsletterComponent } from './build-newsletter/build-newsletter.component';

const routes: Routes = [
  {
    path: '',
    component: ListStepperComponent,
    children: [
      {
        path: '',
        component: TemplatesNewsletterLayoutComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'newsletter',
        component: TemplatesNewsletterLayoutComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'templates-newsletter-code',
        component: TemplatesNewsletterCodeComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'build',
    component: BuildNewsletterComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewsletterRoutingModule {}
