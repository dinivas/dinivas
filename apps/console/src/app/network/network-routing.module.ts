import { MandatorySelectedProjectGuard } from './../core/guards/mandatory-selected-project/mandatory-selected-project.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'radius',
    loadChildren: './radius/radius.module#RadiusModule',
    canActivate: [MandatorySelectedProjectGuard]
  },
  {
    path: 'consul',
    loadChildren: './consul/consul.module#ConsulModule',
    canActivate: [MandatorySelectedProjectGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NetworkRoutingModule {}
