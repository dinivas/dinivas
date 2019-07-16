import { SharedModule } from './../../shared/shared.module';
import { CoreModule } from './../../core/core.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostgresqlRoutingModule } from './postgresql-routing.module';
import { CommonUiModule } from '@dinivas/common-ui';
import { PostgresqlComponent } from './postgresql.component';

@NgModule({
  declarations: [PostgresqlComponent],
  imports: [
    CommonModule,
    CommonUiModule,
    SharedModule,
    CoreModule,
    PostgresqlRoutingModule
  ]
})
export class PostgresqlModule { }
