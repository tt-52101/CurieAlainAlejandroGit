import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DelonABCModule } from '@delon/abc';
import { DelonACLModule } from '@delon/acl';
import { DelonChartModule } from '@delon/chart';
import { DelonFormModule } from '@delon/form';
// delon
import { AlainThemeModule } from '@delon/theme';
// i18n
import { TranslateModule } from '@ngx-translate/core';
// #region third libs
import { NgZorroAntdModule, NZ_NOTIFICATION_CONFIG } from 'ng-zorro-antd';
import { CountdownModule } from 'ngx-countdown';
import { NgxImageGalleryModule } from 'ngx-image-gallery';
// #endregion
// #region your componets & directives
import { PRO_SHARED_COMPONENTS } from '../layout/pro';
import { DelayDirective } from './components/delay/delay.directive';
import { FileManagerComponent } from './components/file-manager/file-manager.component';
import { LangsComponent } from './components/langs/langs.component';
import { MasonryDirective } from './components/masonry/masonry.directive';
import { MouseFocusDirective } from './components/mouse-focus/mouse-focus.directive';
import { ScrollbarDirective } from './components/scrollbar/scrollbar.directive';
import { StatusLabelComponent } from './components/status-label/status-label.component';
import { HourFormatPipe } from './pipes/hour-format.pipe';
import { GlobalSpinComponent } from './components/global-spin/global-spin.component';
import { CronoComponent } from './components/crono/crono.component';
// #endregion

const THIRDMODULES = [
  NgZorroAntdModule,
  CountdownModule,
  DragDropModule,
  NgxImageGalleryModule,
];

const COMPONENTS_ENTRY = [
  LangsComponent,
  FileManagerComponent,
  StatusLabelComponent,
  GlobalSpinComponent
];
const COMPONENTS = [
  CronoComponent,
  ...COMPONENTS_ENTRY,
  ...PRO_SHARED_COMPONENTS
];
const DIRECTIVES = [
  DelayDirective,
  MasonryDirective,
  ScrollbarDirective,
  MouseFocusDirective,
];

const PIPES = [
  HourFormatPipe
]
// #endregion

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AlainThemeModule.forChild(),
    DelonABCModule,
    DelonChartModule,
    DelonACLModule,
    DelonFormModule,
    // third libs
    ...THIRDMODULES,
  ],
  declarations: [
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES,
  ],
  entryComponents: COMPONENTS_ENTRY,
  providers: [
    {
      provide: NZ_NOTIFICATION_CONFIG, useValue: {
        nzTop: '24px',
        nzBottom: '24px',
        nzPlacement: 'topRight',
        nzDuration: 4500,
        nzMaxStack: 1,
        nzPauseOnHover: true,
        nzAnimate: true
      }
    }
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AlainThemeModule,
    DelonABCModule,
    DelonChartModule,
    DelonACLModule,
    DelonFormModule,
    // i18n
    TranslateModule,
    // third libs
    ...THIRDMODULES,
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES
  ]
})
export class SharedModule { }
