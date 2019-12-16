import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { CmsRoutingModule } from './cms-routing.module';
import { ConfigModule } from './config/config.module';

const COMPONENTS = [];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    CmsRoutingModule,
    ConfigModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class CmsModule {}
