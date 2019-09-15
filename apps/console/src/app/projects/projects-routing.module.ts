import { CurrentProjectResolver } from './../shared/project/current-project.resolver';
import { CloudImagesResolver } from './../shared/cloudprovider/cloud-images.resolver';
import { CloudFlavorsResolver } from './../shared/cloudprovider/cloud-flavors.resolver';
import { ProjectWizardComponent } from './project-wizard/project-wizard.component';
import { MandatorySelectedProjectGuard } from './../core/guards/mandatory-selected-project/mandatory-selected-project.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsComponent } from './projects.component';
import { AvailabilityZonesResolver } from './../shared/cloudprovider/availability-zones.resolver';

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
      currentProjectInfo: CurrentProjectResolver,
      availabilityZones: AvailabilityZonesResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule {}
