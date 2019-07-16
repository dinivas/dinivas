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
        path: 'serverinfo',
        component: ServerInfoComponent,
        canActivate: [MandatorySelectedProjectGuard]
      },
      {
        path: 'cloudprovider',
        loadChildren:
          './cloudprovider/cloudprovider.module#CloudproviderModule',
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
