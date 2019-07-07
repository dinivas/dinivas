import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'instances',
    loadChildren: () =>
      import('./instances/instances.module').then(m => m.InstancesModule)
  },
  {
    path: 'disks',
    loadChildren: () => import('./disks/disks.module').then(m => m.DisksModule)
  },
  {
    path: 'images',
    loadChildren: () =>
      import('./images/images.module').then(m => m.ImagesModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComputeRoutingModule {}
