import { CommonUiModule } from '@dinivas/common-ui';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin.component';
import { ServerInfoComponent } from './server-info/server-info.component';

@NgModule({
  declarations: [DashboardComponent, AdminComponent, ServerInfoComponent],
  imports: [
    CommonModule,
    CommonUiModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
