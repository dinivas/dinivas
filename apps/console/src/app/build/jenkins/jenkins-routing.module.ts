import { CloudImagesResolver } from './../../shared/cloudprovider/cloud-images.resolver';
import { CloudFlavorsResolver } from './../../shared/cloudprovider/cloud-flavors.resolver';
import { MandatorySelectedProjectGuard } from './../../core/guards/mandatory-selected-project/mandatory-selected-project.guard';
import { JenkinsWizardComponent } from './jenkins-wizard/jenkins-wizard.component';
import { JenkinsResolver } from './../../shared/jenkins/jenkins.resolver';
import { JenkinsComponent } from './jenkins.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: JenkinsComponent,
    resolve: {
      jenkins: JenkinsResolver
    }
  },
  {
    path: 'new',
    component: JenkinsWizardComponent,
    canActivate: [MandatorySelectedProjectGuard],
    resolve: {
      cloudFlavors: CloudFlavorsResolver,
      cloudImages: CloudImagesResolver
    }
  },
  {
    path: 'edit/:jenkinsId',
    component: JenkinsWizardComponent,
    canActivate: [MandatorySelectedProjectGuard],
    resolve: {
      cloudFlavors: CloudFlavorsResolver,
      cloudImages: CloudImagesResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JenkinsRoutingModule {}
