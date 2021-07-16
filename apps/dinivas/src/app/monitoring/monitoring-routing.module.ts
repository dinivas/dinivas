import { MandatorySelectedProjectGuard } from './../core/guards/mandatory-selected-project/mandatory-selected-project.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: './dashboard/dashboard.module#DashboardModule',
    canActivate: [MandatorySelectedProjectGuard]
  },
  {
    path: 'logging',
    loadChildren: './logging/logging.module#LoggingModule',
    canActivate: [MandatorySelectedProjectGuard]
  },
  {
    path: 'tracing',
    loadChildren: './tracing/tracing.module#TracingModule',
    canActivate: [MandatorySelectedProjectGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonitoringRoutingModule {}
