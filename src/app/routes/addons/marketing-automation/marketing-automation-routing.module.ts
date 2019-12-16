import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddonsMarketingAutomationComponent } from './marketing-automation.component';

const routes: Routes = [
  { path: '', component: AddonsMarketingAutomationComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketingAutomationRoutingModule { }
