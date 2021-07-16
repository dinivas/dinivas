import { CoreModule } from './../core/core.module';
import { CommonUiModule } from '@dinivas/common-ui';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin.component';
import { ServerInfoComponent } from './server-info/server-info.component';
import { ServerMonitorStatusComponent } from './server-monitor-status/server-monitor-status.component';
import { AdminIamModule } from './admin-iam/admin-iam.module';

@NgModule({
  declarations: [
    DashboardComponent,
    AdminComponent,
    ServerInfoComponent,
    ServerMonitorStatusComponent
  ],
  imports: [CommonModule, CoreModule, CommonUiModule, AdminRoutingModule, AdminIamModule]
})
export class AdminModule {}
