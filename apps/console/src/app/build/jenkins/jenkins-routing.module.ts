import { JenkinsStatusComponent } from './jenkins-status/jenkins-status.component';
import { TerraformModuleWizardComponent } from './../../shared/terraform/terraform-module-wizard/terraform-module-wizard.component';
import { CloudImagesResolver } from './../../shared/cloudprovider/cloud-images.resolver';
import { CloudFlavorsResolver } from './../../shared/cloudprovider/cloud-flavors.resolver';
import { MandatorySelectedProjectGuard } from './../../core/guards/mandatory-selected-project/mandatory-selected-project.guard';
import { JenkinsWizardComponent } from './jenkins-wizard/jenkins-wizard.component';
import { JenkinsResolver } from './../../shared/jenkins/jenkins.resolver';
import { JenkinsComponent } from './jenkins.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JenkinsDTO } from '@dinivas/dto';
import { TerraformModuleWizard } from '../../shared/terraform/terraform-module-wizard/terraform-module-wizard';
import { CurrentProjectResolver } from '../../shared/project/current-project.resolver';
import { CurrentJenkinsResolver } from '../../shared/jenkins/jenkins.resolver';
import { JenkinsViewComponent } from './jenkins-view.component';

const moduleWizardData = new TerraformModuleWizard<JenkinsDTO>(
  JenkinsWizardComponent,
  ['/build', 'jenkins'],
  undefined,
  'Jenkins',
  'Jenkins',
  true,
  false,
  false,
  false
);

const routes: Routes = [
  {
    path: '',
    component: JenkinsComponent,
    resolve: {
      jenkinsPage: JenkinsResolver
    }
  },
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
    path: ':jenkinsId',
    component: JenkinsViewComponent,
    resolve: {
      jenkins: CurrentJenkinsResolver,
    },
    children: [
      {
        path: 'status',
        component: JenkinsStatusComponent,
        resolve: {
          currentJenkinsInfo: CurrentJenkinsResolver,
          currentProjectInfo: CurrentProjectResolver
        }
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
          moduleEntity: CurrentJenkinsResolver,
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
export class JenkinsRoutingModule {}
