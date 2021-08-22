import { AdminIAMMemberEditComponent } from './../admin/admin-iam/members/member-edit/member-edit.component';
import { JsonPrettyPipe } from './pipes/json-pretty.pipe';
import { FilterByPipe } from './pipes/filter-by.pipe';
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
  AlertService,
} from './alert/alert.service';
import { NgModule, LOCALE_ID } from '@angular/core';
import { NgxWebstorageModule, LocalStorageService } from 'ngx-webstorage';
import { CommonModule, registerLocaleData } from '@angular/common';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SelectProjectDialogComponent } from './dialog/select-project-dialog/select-project-dialog.component';
import { RouterModule, Router } from '@angular/router';
import locale from '@angular/common/locales/fr';
import { SafePipe } from './pipes/safe.pipe';
import { CloudImageRadiosComponent } from './components/cloud-image-radios/cloud-image-radios.component';
import { CloudFlavorRadiosComponent } from './components/cloud-flavor-radios/cloud-flavor-radios.component';
import { ArchitectureTypeRadiosComponent } from './components/architecture-type-radios/architecture-type-radios.component';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { NeedYourContributionComponent } from './components/need-your-contribution/need-your-contribution.component';
import { BytesPipe } from '../core/pipes/bytes.pipe';
import { SshTerminalComponent } from './components/ssh-terminal/ssh-terminal.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { CloudKeyPairRadiosComponent } from './components/cloud-keypair-radios/cloud-keypair-radios.component';

@NgModule({
  imports: [
    CommonModule,
    CommonUiModule,
    RouterModule,
    NgxWebstorageModule.forRoot({ prefix: 'dinivas', separator: '-' }),
  ],
  exports: [
    FilterBarComponent,
    FilterCriterionComponent,
    SelectedFilterPipe,
    SafePipe,
    BytesPipe,
    JsonPrettyPipe,
    CloudImageRadiosComponent,
    CloudFlavorRadiosComponent,
    CloudKeyPairRadiosComponent,
    ArchitectureTypeRadiosComponent,
    TimeAgoPipe,
    FilterByPipe,
    TruncatePipe,
    NeedYourContributionComponent,
    SshTerminalComponent,
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
    SafePipe,
    BytesPipe,
    CloudImageRadiosComponent,
    CloudFlavorRadiosComponent,
    CloudKeyPairRadiosComponent,
    ArchitectureTypeRadiosComponent,
    TimeAgoPipe,
    JsonPrettyPipe,
    FilterByPipe,
    TruncatePipe,
    NeedYourContributionComponent,
    AdminIAMMemberEditComponent,
    SshTerminalComponent,
  ],
  entryComponents: [
    SnackAlertSuccessComponent,
    SnackAlertWarningComponent,
    SnackAlertDangerComponent,
    ConfirmDialogComponent,
    SelectProjectDialogComponent,
    AdminIAMMemberEditComponent,
    SshTerminalComponent,
  ],
  providers: [
    AlertService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NotificationInterceptor,
      multi: true,
      deps: [AlertService, Router, LocalStorageService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true,
      deps: [LocalStorageService],
    },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 10000 } },
    {
      provide: LOCALE_ID,
      useValue: 'fr-FR',
    },
    MandatorySelectedProjectGuard,
  ],
})
export class CoreModule {
  constructor() {
    registerLocaleData(locale);
  }
}
