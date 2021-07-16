import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonitoringRoutingModule } from './monitoring-routing.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { LoggingModule } from './logging/logging.module';
import { TracingModule } from './tracing/tracing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MonitoringRoutingModule,
    DashboardModule,
    LoggingModule,
    TracingModule
  ]
})
export class MonitoringModule { }
