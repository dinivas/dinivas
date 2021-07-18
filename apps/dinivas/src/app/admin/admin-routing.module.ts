import { ServerMonitorStatusComponent } from './server-monitor-status/server-monitor-status.component';
import { ServerInfoComponent } from './server-info/server-info.component';
import { AdminComponent } from './admin.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BullDashboardComponent } from './bull-dashboard/bull-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'server-info',
        component: ServerInfoComponent,
      },
      {
        path: 'server-monitor-status',
        component: ServerMonitorStatusComponent,
      },
      {
        path: 'bull-dashboard',
        component: BullDashboardComponent,
      },
      {
        path: 'cloudproviders',
        loadChildren: () =>
          import('./cloudproviders/cloudproviders.module').then(
            (m) => m.CloudprovidersModule
          ),
      },
      {
        path: 'admin-iam',
        loadChildren: () =>
          import('./admin-iam/admin-iam.module').then((m) => m.AdminIamModule),
      },
      {
        path: 'terraform-state',
        loadChildren: () =>
          import('./terraform-state/terraform-state.module').then(
            (m) => m.TerraformStateModule
          ),
      },
      { path: '', redirectTo: 'server-monitor-status' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
