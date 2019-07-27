import { ApiInterceptor } from './interceptor/api.interceptor';
import { MandatorySelectedProjectGuard } from './guards/mandatory-selected-project/mandatory-selected-project.guard';
import { NotificationInterceptor } from './interceptor/notification.interceptor';
import { CommonUiModule } from '@dinivas/common-ui';
import { FilterCriterionComponent } from './entity/filter-criterion/filter-criterion.component';
import { SelectedFilterPipe } from './entity/filter-bar/selected-filter.pipe';
import { FilterBarComponent } from './entity/filter-bar/filter-bar.component';
import { ConfirmDialogComponent } from './dialog/confirm-dialog/confirm-dialog.component';
import {
  SnackAlertSuccessComponent,
  SnackAlertWarningComponent,
  SnackAlertDangerComponent,
  AlertService
} from './alert/alert.service';
import { NgModule, LOCALE_ID } from '@angular/core';
import { NgxWebstorageModule, LocalStorageService } from 'ngx-webstorage';
import { CommonModule, registerLocaleData } from '@angular/common';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  SelectProjectDialogComponent,
  SelectProjectDialogEntryComponent
} from './dialog/select-project-dialog/select-project-dialog.component';
import { RouterModule, Router } from '@angular/router';
import { NgMathPipesModule, BytesPipe } from 'angular-pipes';
import locale from '@angular/common/locales/fr';

@NgModule({
  imports: [
    CommonModule,
    CommonUiModule,
    NgMathPipesModule,
    RouterModule,
    NgxWebstorageModule.forRoot({ prefix: 'dinivas', separator: '-' })
  ],
  exports: [
    FilterBarComponent,
    FilterCriterionComponent,
    SelectedFilterPipe,
    BytesPipe
  ],
  declarations: [
    SnackAlertSuccessComponent,
    SnackAlertWarningComponent,
    SnackAlertDangerComponent,
    FilterBarComponent,
    SelectedFilterPipe,
    FilterCriterionComponent,
    ConfirmDialogComponent,
    SelectProjectDialogComponent,
    SelectProjectDialogEntryComponent
  ],
  entryComponents: [
    SnackAlertSuccessComponent,
    SnackAlertWarningComponent,
    SnackAlertDangerComponent,
    ConfirmDialogComponent,
    SelectProjectDialogComponent
  ],
  providers: [
    AlertService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NotificationInterceptor,
      multi: true,
      deps: [AlertService, Router, LocalStorageService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true,
      deps: [LocalStorageService]
    },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 10000 } },
    {
      provide: LOCALE_ID,
      useValue: 'fr-FR'
    },
    MandatorySelectedProjectGuard
  ]
})
export class CoreModule {
  constructor() {
    registerLocaleData(locale);
  }
}
