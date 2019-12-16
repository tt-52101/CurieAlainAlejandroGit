import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileManagerComponent } from './file-manager.component';
import { SharedModule } from '@shared';
import { FileManagerRoutingModule } from './file-manager-routing.module';
import { FilesComponent } from './files/files.component';
import { DriveCredentialsComponent } from './drive-credentials/drive-credentials.component';

const COMPONENTS = [
  FileManagerComponent
];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FileManagerRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
    FilesComponent,
    DriveCredentialsComponent,
  ],
  entryComponents: COMPONENTS_NOROUNT,
  providers: []
})
export class FileManagerModule { }
