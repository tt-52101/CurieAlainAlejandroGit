import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TrackerComponent } from './tracker.component';
import { ViewchartComponent } from './viewchart/viewchart.component';
import { ViewsiteComponent } from './viewsite/viewsite.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: TrackerComponent },
  { path: 'site/:id/:action', component: ViewchartComponent },
  { path: 'siteinfo/:id', component: ViewsiteComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class TrackerRoutingModule { }
