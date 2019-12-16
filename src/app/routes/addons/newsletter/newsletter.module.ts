import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { NewsletterRoutingModule } from './newsletter-routing.module';
import { ListStepperComponent } from './list-stepper/list-stepper.component';
import { TemplatesNewsletterLayoutComponent } from './templates-newsletter-layout/templates-newsletter-layout.component';
import { TemplatesNewsletterCodeComponent } from './templates-newsletter-code/templates-newsletter-code.component';
import { BuildNewsletterComponent } from './build-newsletter/build-newsletter.component';

const COMPONENTS = [ListStepperComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    NewsletterRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
    ListStepperComponent,
    TemplatesNewsletterLayoutComponent,
    TemplatesNewsletterCodeComponent,
    BuildNewsletterComponent
  ],
  entryComponents: COMPONENTS_NOROUNT,
  providers:[
  ]
})
export class NewsletterModule { }
