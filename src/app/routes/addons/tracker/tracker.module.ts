import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackerRoutingModule } from './tracker-routing.module';
import { TrackerComponent } from './tracker.component';
import { SharedModule } from '@shared';
import { HttpClientModule } from '@angular/common/http';
import { TrackerService } from '@core';
import { ViewchartComponent } from './viewchart/viewchart.component';
import { ViewsiteComponent } from './viewsite/viewsite.component';

const COMPONENTS = [TrackerComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    CommonModule,
    TrackerRoutingModule,
    SharedModule,
    HttpClientModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
    ViewchartComponent,
    ViewsiteComponent
  ],
  providers: [
    TrackerService
  ]
})
export class TrackerModule { }
