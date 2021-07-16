import { CurrentGitlabResolver } from './../../shared/gitlab/gitlab.resolver';
import { GitlabStatusComponent } from './gitlab-status/gitlab-status.component';
import { GitlabViewComponent } from './gitlab-view.component';
import { CloudImagesResolver } from './../../shared/cloudprovider/cloud-images.resolver';
import { CurrentProjectResolver } from './../../shared/project/current-project.resolver';
import { CloudFlavorsResolver } from './../../shared/cloudprovider/cloud-flavors.resolver';
import { MandatorySelectedProjectGuard } from './../../core/guards/mandatory-selected-project/mandatory-selected-project.guard';
import { TerraformModuleWizardComponent } from './../../shared/terraform/terraform-module-wizard/terraform-module-wizard.component';
import { GitlabWizardComponent } from './gitlab-wizard/gitlab-wizard.component';
import { TerraformModuleWizard } from './../../shared/terraform/terraform-module-wizard/terraform-module-wizard';
import { GitlabComponent } from './gitlab.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GitlabDTO } from '@dinivas/api-interfaces';

const moduleWizardData = new TerraformModuleWizard<GitlabDTO>(
  GitlabWizardComponent,
  ['/build', 'gitlab'],
  undefined,
  'Gitlab',
  'Gitlab',
  true,
  false,
  false,
  false
);

const routes: Routes = [
  { path: '', component: GitlabComponent },
  {
    path: 'new',
    component: TerraformModuleWizardComponent,
    canActivate: [MandatorySelectedProjectGuard],
    data: {
      moduleWizard: moduleWizardData
    },
    resolve: {
      cloudFlavors: CloudFlavorsResolver,
      cloudImages: CloudImagesResolver,
      currentProjectInfo: CurrentProjectResolver
    }
  },
  {
    path: ':gitlabId',
    component: GitlabViewComponent,
    resolve: {
      gitlab: CurrentGitlabResolver
    },
    children: [
      {
        path: 'status',
        component: GitlabStatusComponent
      },
      {
        path: 'edit',
        component: TerraformModuleWizardComponent,
        canActivate: [MandatorySelectedProjectGuard],
        data: {
          moduleWizard: moduleWizardData
        },
        resolve: {
          cloudFlavors: CloudFlavorsResolver,
          cloudImages: CloudImagesResolver,
          moduleEntity: CurrentGitlabResolver,
          currentProjectInfo: CurrentProjectResolver
        }
      },
      {
        path: '**',
        redirectTo: 'status'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GitlabRoutingModule {}
