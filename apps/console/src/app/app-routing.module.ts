import { SelectProjectDialogComponent } from './core/dialog/select-project-dialog/select-project-dialog.component';
import { MandatorySelectedProjectGuard } from './core/guards/mandatory-selected-project/mandatory-selected-project.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: './home/home.module#HomeModule',
    canActivate: [MandatorySelectedProjectGuard]
  },
  {
    path: 'admin',
    loadChildren: './admin/admin.module#AdminModule',
    canActivate: [MandatorySelectedProjectGuard]
  },
  {
    path: 'compute',
    loadChildren: './compute/compute.module#ComputeModule',
    canActivate: [MandatorySelectedProjectGuard]
  },
  {
    path: 'cluster',
    loadChildren: './cluster/cluster.module#ClusterModule',
    canActivate: [MandatorySelectedProjectGuard]
  },
  {
    path: 'network',
    loadChildren: './network/network.module#NetworkModule',
    canActivate: [MandatorySelectedProjectGuard]
  },
  {
    path: 'build',
    loadChildren: './build/build.module#BuildModule'
  },
  {
    path: 'storage',
    loadChildren: './storage/storage.module#StorageModule',
    canActivate: [MandatorySelectedProjectGuard]
  },
  {
    path: 'projects',
    loadChildren: './projects/projects.module#ProjectsModule',
    canActivate: [MandatorySelectedProjectGuard]
  },
  {
    path: 'messaging',
    loadChildren: './messaging/messaging.module#MessagingModule',
    canActivate: [MandatorySelectedProjectGuard]
  },
  {
    path: 'iam-admin',
    loadChildren: './iam/iam.module#IamModule',
    canActivate: [MandatorySelectedProjectGuard]
  },
  {
    path: 'selectProject',
    component: SelectProjectDialogComponent
  },
  { path: '**', redirectTo: '', pathMatch: 'prefix' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      //enableTracing: !environment.production,
      enableTracing: false,
      paramsInheritanceStrategy: 'always',
      initialNavigation: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
