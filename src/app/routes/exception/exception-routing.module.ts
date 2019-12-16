import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Exception403Component } from './403.component';
import { Exception404Component } from './404.component';
import { Exception500Component } from './500.component';
import { ExceptionTriggerComponent } from './trigger.component';
import { Exception401Component } from './401.component';

const routes: Routes = [
  { path: '401', component: Exception401Component },
  { path: '403', component: Exception403Component },
  { path: '404', component: Exception404Component },
  { path: '500', component: Exception500Component },
  { path: 'trigger', component: ExceptionTriggerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExceptionRoutingModule {}
