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
import { NgModule, LOCALE_ID, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  SelectProjectDialogComponent,
  SelectProjectDialogEntryComponent
} from './dialog/select-project-dialog/select-project-dialog.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    CommonUiModule,
    RouterModule
  ],
  exports: [FilterBarComponent, FilterCriterionComponent, SelectedFilterPipe],
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
      deps: [Injector]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 10000 } },
    {
      provide: LOCALE_ID,
      useValue: 'fr-FR'
    },
    MandatorySelectedProjectGuard
  ]
})
export class CoreModule {}
