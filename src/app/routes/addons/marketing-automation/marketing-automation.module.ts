import { AddonsMarketingAutomationComponent } from './marketing-automation.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { MarketingAutomationRoutingModule } from './marketing-automation-routing.module';
import { ModulosService, I18NService } from '@core';
import { DelonFormModule } from "@delon/form";


const COMPONENTS = [ AddonsMarketingAutomationComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    MarketingAutomationRoutingModule,
    DelonFormModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  providers:[
    ModulosService,
    I18NService
  ]
})
export class MarketingAutomationModule { }
