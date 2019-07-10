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
import { CommonModule } from '@angular/common';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material';

@NgModule({
  declarations: [
    SnackAlertSuccessComponent,
    SnackAlertWarningComponent,
    SnackAlertDangerComponent,
    FilterBarComponent,
    SelectedFilterPipe,
    FilterCriterionComponent,
    ConfirmDialogComponent
  ],
  imports: [CommonModule, CommonUiModule],
  exports: [FilterBarComponent, FilterCriterionComponent, SelectedFilterPipe],
  entryComponents: [
    SnackAlertSuccessComponent,
    SnackAlertWarningComponent,
    SnackAlertDangerComponent,
    ConfirmDialogComponent
  ],
  providers: [
    AlertService,
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 10000 } },
    {
      provide: LOCALE_ID,
      useValue: 'fr-FR'
    }
  ]
})
export class CoreModule {}
