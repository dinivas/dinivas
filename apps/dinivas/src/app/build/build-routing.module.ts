import { MandatorySelectedProjectGuard } from './../core/guards/mandatory-selected-project/mandatory-selected-project.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'jenkins',
    loadChildren: () =>
      import('./jenkins/jenkins.module').then((m) => m.JenkinsModule),
    canActivate: [MandatorySelectedProjectGuard],
  },
  {
    path: 'gitlab',
    loadChildren: () =>
      import('./gitlab/gitlab.module').then((m) => m.GitlabModule),
    canActivate: [MandatorySelectedProjectGuard],
  },
  {
    path: 'droneci',
    loadChildren: () =>
      import('./droneci/droneci.module').then((m) => m.DroneciModule),
    canActivate: [MandatorySelectedProjectGuard],
  },
  {
    path: 'ansible',
    loadChildren: () =>
      import('./ansible/ansible.module').then((m) => m.AnsibleModule),
  },
  {
    path: 'harbor',
    loadChildren: () =>
      import('./harbor/harbor.module').then((m) => m.HarborModule),
  },
  {
    path: 'nexus',
    loadChildren: () =>
      import('./nexus/nexus.module').then((m) => m.NexusModule),
  },
  { path: '', redirectTo: 'jenkins', pathMatch: 'prefix' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuildRoutingModule {}
