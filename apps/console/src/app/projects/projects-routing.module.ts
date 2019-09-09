import { CurrentProjectResolver } from './../shared/project/current-project.resolver';
import { CloudImagesResolver } from './../shared/cloudprovider/cloud-images.resolver';
import { CloudFlavorsResolver } from './../shared/cloudprovider/cloud-flavors.resolver';
import { ProjectWizardComponent } from './project-wizard/project-wizard.component';
import { MandatorySelectedProjectGuard } from './../core/guards/mandatory-selected-project/mandatory-selected-project.guard';
import { ProjectEditComponent } from './project-edit/project-edit.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsComponent } from './projects.component';

const routes: Routes = [
  { path: '', component: ProjectsComponent },
  {
    path: 'new',
    component: ProjectWizardComponent,
    canActivate: [MandatorySelectedProjectGuard]
  },
  {
    path: 'edit/:projectId',
    component: ProjectWizardComponent,
    canActivate: [MandatorySelectedProjectGuard],
    resolve: {
      cloudFlavors: CloudFlavorsResolver,
      cloudImages: CloudImagesResolver,
      currentProjectInfo: CurrentProjectResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule {}
