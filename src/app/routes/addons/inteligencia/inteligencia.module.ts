import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { InteligenciaService, ModulosService } from '@core';
import { SharedModule } from '@shared';
import { DisplaypopcardComponent } from '@shared/components/displaypopcard/displaypopcard.component';
import { CardviewInteligenciaComponent } from './cardview-inteligencia/cardview-inteligencia.component';
import { InteligenciaCurdviewComponent } from './curdview/curdview.component';
import { InteligenciaCurdviewEditComponent } from './curdview/edit/edit.component';
import { InteligenciaCurdviewViewComponent } from './curdview/view/view.component';
import { InteligenciaFormClusteringComponent } from './form-clustering/form-clustering.component';
import { InteligenciaRoutingModule } from './inteligencia-routing.module';
import { InteligenciaComponent } from './inteligencia.component';
import { InteligenciaRegressionComponent } from './regression/regression.component';







/**@ignore */
const COMPONENTS = [
  InteligenciaComponent,
  InteligenciaFormClusteringComponent,
  InteligenciaCurdviewComponent,
  InteligenciaRegressionComponent];
/**@ignore */
const COMPONENTS_NOROUNT = [
  InteligenciaCurdviewEditComponent,
  InteligenciaCurdviewViewComponent];

@NgModule({
  imports: [
    SharedModule,
    InteligenciaRoutingModule,
    HttpClientModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
    CardviewInteligenciaComponent,
    DisplaypopcardComponent
  ],
  entryComponents: COMPONENTS_NOROUNT,
  providers:[
    InteligenciaService,
    ModulosService
  ]
})
export class InteligenciaModule { }
