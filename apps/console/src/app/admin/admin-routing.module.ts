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
      { path: 'dashboard', component: DashboardComponent },
      { path: 'serverinfo', component: ServerInfoComponent },
      {
        path: 'cloudprovider',
        loadChildren: './cloudprovider/cloudprovider.module#CloudproviderModule'
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
