import { PostgresqlViewComponent } from './postgresql-view.component';
import { SharedModule } from './../../shared/shared.module';
import { CoreModule } from './../../core/core.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostgresqlRoutingModule } from './postgresql-routing.module';
import { CommonUiModule } from '@dinivas/common-ui';
import { PostgresqlComponent } from './postgresql.component';
import { PostgresqlWizardVarsComponent } from './postgresql-wizard-vars/postgresql-wizard-vars.component';
import { PostgresqlStatusComponent } from './postgresql-status/postgresql-status.component';

@NgModule({
  declarations: [
    PostgresqlComponent,
    PostgresqlWizardVarsComponent,
    PostgresqlStatusComponent,
    PostgresqlViewComponent
  ],
  imports: [
    CommonModule,
    CommonUiModule,
    SharedModule,
    CoreModule,
    PostgresqlRoutingModule
  ],
  entryComponents: [PostgresqlWizardVarsComponent]
})
export class PostgresqlModule {}
