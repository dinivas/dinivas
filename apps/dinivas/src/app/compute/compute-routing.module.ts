import { MandatorySelectedProjectGuard } from './../core/guards/mandatory-selected-project/mandatory-selected-project.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'instances',
    loadChildren: () =>
      import('./instances/instances.module').then((m) => m.InstancesModule),
    canActivate: [MandatorySelectedProjectGuard],
  },
  {
    path: 'disks',
    loadChildren: () =>
      import('./disks/disks.module').then((m) => m.DisksModule),
    canActivate: [MandatorySelectedProjectGuard],
  },
  {
    path: 'images',
    loadChildren: () =>
      import('./images/images.module').then((m) => m.ImagesModule),
    canActivate: [MandatorySelectedProjectGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComputeRoutingModule {}
