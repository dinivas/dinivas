import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'jenkins', loadChildren: './jenkins/jenkins.module#JenkinsModule' },
  { path: 'gitlab', loadChildren: './gitlab/gitlab.module#GitlabModule' },
  { path: 'droneci', loadChildren: './droneci/droneci.module#DroneciModule' },
  { path: 'ansible', loadChildren: './ansible/ansible.module#AnsibleModule' },
  { path: '', redirectTo: 'jenkins', pathMatch: 'prefix' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuildRoutingModule { }
