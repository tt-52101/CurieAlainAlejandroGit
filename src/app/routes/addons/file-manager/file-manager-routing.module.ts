import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FileManagerComponent } from './file-manager.component';
import { DriveCredentialsComponent } from './drive-credentials/drive-credentials.component';
import { AuthGuard } from '@shared/guards/auth.guard';

const routes: Routes = [
  { path: '', component: FileManagerComponent },
  // { path: 'DriveCredentials', component: DriveCredentialsComponent, canActivate: [AuthGuard] }
  { path: 'DriveCredentials', component: DriveCredentialsComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class FileManagerRoutingModule { }
