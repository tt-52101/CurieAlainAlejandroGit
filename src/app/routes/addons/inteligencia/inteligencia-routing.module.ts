import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InteligenciaComponent } from './inteligencia.component';
import { InteligenciaFormClusteringComponent } from './form-clustering/form-clustering.component';
import {CardviewInteligenciaComponent } from './cardview-inteligencia/cardview-inteligencia.component';
import { InteligenciaCurdviewComponent } from './curdview/curdview.component';
import { InteligenciaRegressionComponent } from './regression/regression.component';





const routes: Routes = [
  { path: '', component: InteligenciaComponent,    
    children:[
        { path: '', component: CardviewInteligenciaComponent},
        { path: 'view',  component: CardviewInteligenciaComponent },
        { path: 'clustering',  component: InteligenciaFormClusteringComponent },
        { path: 'regression',  component: InteligenciaRegressionComponent },
      ]
  },
  { path: 'curdview', component: InteligenciaCurdviewComponent },
  { path: 'regression', component: InteligenciaRegressionComponent }];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class InteligenciaRoutingModule { }
