import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RedisRoutingModule } from './redis-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RedisRoutingModule
  ]
})
export class RedisModule { }
