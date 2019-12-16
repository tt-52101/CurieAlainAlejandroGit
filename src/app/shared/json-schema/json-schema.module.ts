import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { DelonFormModule, WidgetRegistry } from '@delon/form';

import { AddressWidget } from './widgets/address/address.widget';

export const SCHEMA_THIRDS_COMPONENTS = [
  AddressWidget,
];

@NgModule({
  declarations: SCHEMA_THIRDS_COMPONENTS,
  entryComponents: SCHEMA_THIRDS_COMPONENTS,
  imports: [SharedModule, DelonFormModule.forRoot()],
  exports: [...SCHEMA_THIRDS_COMPONENTS],
})
export class JsonSchemaModule {
  constructor(widgetRegistry: WidgetRegistry) {
    widgetRegistry.register(AddressWidget.KEY, AddressWidget);
  }
}
