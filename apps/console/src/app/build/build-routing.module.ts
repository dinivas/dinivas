import { MandatorySelectedProjectGuard } from './../core/guards/mandatory-selected-project/mandatory-selected-project.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'jenkins', loadChildren: './jenkins/jenkins.module#JenkinsModule', canActivate: [MandatorySelectedProjectGuard] },
  { path: 'gitlab', loadChildren: './gitlab/gitlab.module#GitlabModule', canActivate: [MandatorySelectedProjectGuard] },
  { path: 'droneci', loadChildren: './droneci/droneci.module#DroneciModule', canActivate: [MandatorySelectedProjectGuard] },
  { path: 'ansible', loadChildren: './ansible/ansible.module#AnsibleModule'},
  { path: '', redirectTo: 'jenkins', pathMatch: 'prefix' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuildRoutingModule { }
