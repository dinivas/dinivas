import { MandatorySelectedProjectGuard } from './../core/guards/mandatory-selected-project/mandatory-selected-project.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'instances',
    loadChildren: './instances/instances.module#InstancesModule',
    canActivate: [MandatorySelectedProjectGuard]
  },
  {
    path: 'disks',
    loadChildren: './disks/disks.module#DisksModule',
    canActivate: [MandatorySelectedProjectGuard]
  },
  {
    path: 'images',
    loadChildren: './images/images.module#ImagesModule',
    canActivate: [MandatorySelectedProjectGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComputeRoutingModule {}
