import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'home', loadChildren: './home/home.module#HomeModule' },
  { path: 'admin', loadChildren: './admin/admin.module#AdminModule' },
  { path: 'compute', loadChildren: './compute/compute.module#ComputeModule' },
  { path: 'build', loadChildren: './build/build.module#BuildModule' },
  { path: 'storage', loadChildren: './storage/storage.module#StorageModule' },
  {
    path: 'messaging',
    loadChildren: './messaging/messaging.module#MessagingModule'
  },
  { path: '', redirectTo: 'home', pathMatch: 'prefix' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
