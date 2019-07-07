import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostgresqlRoutingModule } from './postgresql-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    PostgresqlRoutingModule
  ]
})
export class PostgresqlModule { }
