import { MandatorySelectedProjectGuard } from './../core/guards/mandatory-selected-project/mandatory-selected-project.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'kubernetes',
    loadChildren: () =>
      import('./kubernetes/kubernetes.module').then((m) => m.KubernetesModule),
    canActivate: [MandatorySelectedProjectGuard],
  },
  {
    path: 'openshift',
    loadChildren: () =>
      import('./openshift/openshift.module').then((m) => m.OpenshiftModule),
    canActivate: [MandatorySelectedProjectGuard],
  },
  {
    path: 'dockerswarm',
    loadChildren: () =>
      import('./dockerswarm/dockerswarm.module').then(
        (m) => m.DockerswarmModule
      ),
    canActivate: [MandatorySelectedProjectGuard],
  },
  { path: '', redirectTo: 'kubernetes', pathMatch: 'prefix' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClusterRoutingModule {}
