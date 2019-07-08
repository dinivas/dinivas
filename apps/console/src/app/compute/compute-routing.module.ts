import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'instances',
    loadChildren: './instances/instances.module#InstancesModule'
  },
  {
    path: 'disks',
    loadChildren: './disks/disks.module#DisksModule'
  },
  {
    path: 'images',
    loadChildren: './images/images.module#ImagesModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComputeRoutingModule {}
