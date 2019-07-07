import { DashboardComponent } from './home/dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // Admin module
  {path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule)},
  // Admin module
  {path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)},
  // Compute module
  {path: 'compute', loadChildren: () => import('./compute/compute.module').then(m => m.ComputeModule)},
  // Build (CI/CD)
  {path: 'build', loadChildren: () => import('./build/build.module').then(m => m.BuildModule)},
  // Storage
  {path: 'storage', loadChildren: () => import('./storage/storage.module').then(m => m.StorageModule)},
  // Messaging
  {path: 'messaging', loadChildren: () => import('./messaging/messaging.module').then(m => m.MessagingModule)},
  { path: '',   redirectTo: 'home', pathMatch: 'prefix' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { initialNavigation: 'enabled' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
