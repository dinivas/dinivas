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
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [MandatorySelectedProjectGuard]
      },
      {
        path: 'server-info',
        component: ServerInfoComponent,
        canActivate: [MandatorySelectedProjectGuard]
      },
      {
        path: 'server-monitor-status',
        component: ServerMonitorStatusComponent,
        canActivate: [MandatorySelectedProjectGuard]
      },
      {
        path: 'cloudproviders',
        loadChildren:
          './cloudproviders/cloudproviders.module#CloudprovidersModule',
        canActivate: [MandatorySelectedProjectGuard]
      },
      { path: '', redirectTo: 'dashboard' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
