import { ServerMonitorStatusComponent } from './server-monitor-status/server-monitor-status.component';
import { MandatorySelectedProjectGuard } from './../core/guards/mandatory-selected-project/mandatory-selected-project.guard';
import { ServerInfoComponent } from './server-info/server-info.component';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'server-info',
        component: ServerInfoComponent
      },
      {
        path: 'server-monitor-status',
        component: ServerMonitorStatusComponent
      },
      {
        path: 'cloudproviders',
        loadChildren:
          './cloudproviders/cloudproviders.module#CloudprovidersModule'
      },
      {
        path: 'admin-iam',
        loadChildren:
          './admin-iam/admin-iam.module#AdminIamModule'
      },
      {
        path: 'terraform-state',
        loadChildren:
          './terraform-state/terraform-state.module#TerraformStateModule'
      },
      { path: '', redirectTo: 'server-monitor-status' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
