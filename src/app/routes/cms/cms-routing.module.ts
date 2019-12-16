import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GeneralComponent } from './config/general/general.component';
import { ConfigComponent } from './config/config.component';
import { DeploymentComponent } from './config/deployment/deployment/deployment.component';

const routes: Routes = [

 // { path: 'config', component: ConfigComponent},
 // { path: 'config/general' , component: GeneralComponent },
  // { path: '', redirectTo: 'config/general', component: GeneralComponent },
  {
        path: 'config',
        component: ConfigComponent,
        children: [
          { path: '', redirectTo: 'general', pathMatch: 'full' },
          {
            path: 'general',
            component: GeneralComponent,
          },
          {
            path: 'deployment',
            component: DeploymentComponent
          }
        ]
      }

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CmsRoutingModule { }
