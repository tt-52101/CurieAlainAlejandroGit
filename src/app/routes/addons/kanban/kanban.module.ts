import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { DueDateColorDirective } from './components/due-date-color.directive';
import { PlanningFormComponent } from './components/planning-form/planning-form.component';
import { KanbanRoutingModule } from './kanban-routing.module';
import { KanbanComponent } from './kanban.component';
import { AdminRoleDirective } from './components/admin-role.directive';

const ENTRY_COMPONENTS = [
  PlanningFormComponent
]
const COMPONENTS = [
  KanbanComponent,
  DueDateColorDirective,
  AdminRoleDirective,
  ...ENTRY_COMPONENTS
];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    KanbanRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
    DueDateColorDirective
  ],
  providers: [

  ],
  entryComponents: [
    ...ENTRY_COMPONENTS
  ]
})
export class KanbanModule { }
