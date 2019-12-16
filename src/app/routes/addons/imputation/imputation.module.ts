import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18NService, ModulosService } from '@core';
import { SharedModule } from '@shared';
import { ImputationRoutingModule } from './imputation-routing.module';
import { ImputationComponent } from './imputation.component';
import { CallModalFormComponent } from './components/call-modal-form/call-modal-form.component';
import { NZ_MESSAGE_CONFIG } from 'ng-zorro-antd';

const components = [
  ImputationComponent,
  CallModalFormComponent
];

@NgModule({
  imports: [
    CommonModule,
    ImputationRoutingModule,
    SharedModule,
  ],
  declarations: [
    ...components
  ],
  providers: [
    ModulosService,
    I18NService,
  ]
})
export class ImputationModule { }
