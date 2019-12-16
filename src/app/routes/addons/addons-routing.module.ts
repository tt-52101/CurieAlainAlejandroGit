import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

const routes: Routes = [
  { path: 'fileManager', loadChildren: './file-manager/file-manager.module#FileManagerModule' },
  { path: 'inteligencia', loadChildren: './inteligencia/inteligencia.module#InteligenciaModule' },
  { path: 'marketing-automation', loadChildren: './marketing-automation/marketing-automation.module#MarketingAutomationModule' },
  { path: 'newsletter', loadChildren: './newsletter/newsletter.module#NewsletterModule' },
  { path: 'landingpage', loadChildren: './landingpage/landingpage.module#LandingPageModule' },
  { path: 'tracker', loadChildren: './tracker/tracker.module#TrackerModule' },
  { path: 'FormModulos', loadChildren: './form-modulos/form-modulos.module#FormModulosModule' },
  { path: 'imputation', loadChildren: './imputation/imputation.module#ImputationModule' },
  { path: 'kanban', loadChildren: './kanban/kanban.module#KanbanModule' },
  { path: 'form-build', loadChildren: './form-build/form-build.module#FormBuildModule' },

]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddonsRoutingModule { }

