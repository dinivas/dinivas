import { MandatorySelectedProjectGuard } from './../core/guards/mandatory-selected-project/mandatory-selected-project.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'kubernetes',
    loadChildren: './kubernetes/kubernetes.module#KubernetesModule',
    canActivate: [MandatorySelectedProjectGuard]
  },
  {
    path: 'openshift',
    loadChildren: './openshift/openshift.module#OpenshiftModule',
    canActivate: [MandatorySelectedProjectGuard]
  },
  {
    path: 'dockerswarm',
    loadChildren: './dockerswarm/dockerswarm.module#DockerswarmModule',
    canActivate: [MandatorySelectedProjectGuard]
  },
  { path: '', redirectTo: 'kubernetes', pathMatch: 'prefix' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClusterRoutingModule {}
