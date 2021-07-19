import { MandatorySelectedProjectGuard } from './../core/guards/mandatory-selected-project/mandatory-selected-project.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'radius',
    loadChildren: () =>
      import('./radius/radius.module').then((m) => m.RadiusModule),
    canActivate: [MandatorySelectedProjectGuard],
  },
  {
    path: 'consul',
    loadChildren: () =>
      import('./consul/consul.module').then((m) => m.ConsulModule),
    canActivate: [MandatorySelectedProjectGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NetworkRoutingModule {}
