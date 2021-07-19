import { MandatorySelectedProjectGuard } from './../core/guards/mandatory-selected-project/mandatory-selected-project.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [MandatorySelectedProjectGuard],
  },
  {
    path: 'logging',
    loadChildren: () =>
      import('./logging/logging.module').then((m) => m.LoggingModule),
    canActivate: [MandatorySelectedProjectGuard],
  },
  {
    path: 'tracing',
    loadChildren: () =>
      import('./tracing/tracing.module').then((m) => m.TracingModule),
    canActivate: [MandatorySelectedProjectGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MonitoringRoutingModule {}
