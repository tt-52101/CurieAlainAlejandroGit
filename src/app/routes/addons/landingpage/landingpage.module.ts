import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { LandingPageRoutingModule } from './landingpage-routing.module';
import { ListStepperComponent } from './list-stepper/list-stepper.component';
import { TemplatesCodeComponent } from './templates-code/templates-code.component';
import { TemplatesLayoutComponent } from './templates-layout/templates-layout.component';
import { BuildLandingpageComponent } from './build-landingpage/build-landingpage.component';

const COMPONENTS = [ListStepperComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    LandingPageRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
    ListStepperComponent,
    TemplatesCodeComponent,
    TemplatesLayoutComponent,
    BuildLandingpageComponent
  ],
  entryComponents: COMPONENTS_NOROUNT,
  providers:[
  ]
})
export class LandingPageModule { }
