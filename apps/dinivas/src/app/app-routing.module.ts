import { environment } from './../environments/environment';
import { SelectProjectDialogComponent } from './core/dialog/select-project-dialog/select-project-dialog.component';
import { MandatorySelectedProjectGuard } from './core/guards/mandatory-selected-project/mandatory-selected-project.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
    canActivate: [MandatorySelectedProjectGuard],
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
    canActivate: [MandatorySelectedProjectGuard],
  },
  {
    path: 'compute',
    loadChildren: () =>
      import('./compute/compute.module').then((m) => m.ComputeModule),
    canActivate: [MandatorySelectedProjectGuard],
  },
  {
    path: 'cluster',
    loadChildren: () =>
      import('./cluster/cluster.module').then((m) => m.ClusterModule),
    canActivate: [MandatorySelectedProjectGuard],
  },
  {
    path: 'network',
    loadChildren: () =>
      import('./network/network.module').then((m) => m.NetworkModule),
    canActivate: [MandatorySelectedProjectGuard],
  },
  {
    path: 'build',
    loadChildren: () =>
      import('./build/build.module').then((m) => m.BuildModule),
  },
  {
    path: 'storage',
    loadChildren: () =>
      import('./storage/storage.module').then((m) => m.StorageModule),
    canActivate: [MandatorySelectedProjectGuard],
  },
  {
    path: 'projects',
    loadChildren: () =>
      import('./projects/projects.module').then((m) => m.ProjectsModule),
    canActivate: [MandatorySelectedProjectGuard],
  },
  {
    path: 'messaging',
    loadChildren: () =>
      import('./messaging/messaging.module').then((m) => m.MessagingModule),
    canActivate: [MandatorySelectedProjectGuard],
  },
  {
    path: 'iam-admin',
    loadChildren: () => import('./iam/iam.module').then((m) => m.IamModule),
    canActivate: [MandatorySelectedProjectGuard],
  },
  {
    path: 'selectProject',
    component: SelectProjectDialogComponent,
  },
  { path: '**', redirectTo: '', pathMatch: 'prefix' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      enableTracing: false, //!environment.production,
      paramsInheritanceStrategy: 'always',
      initialNavigation: 'enabled',
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
