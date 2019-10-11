import { ProjectViewComponent } from './project-view.component';
import { ProjectStatusComponent } from './project-status/project-status.component';
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
    path: ':projectId',
    component: ProjectViewComponent,
    resolve: {
      currentProjectInfo: CurrentProjectResolver
    },
    children: [
      {
        path: 'status',
        component: ProjectStatusComponent,
        resolve: {
          currentProjectInfo: CurrentProjectResolver
        }
      },
      {
        path: 'edit',
        component: ProjectWizardComponent,
        canActivate: [MandatorySelectedProjectGuard],
        resolve: {
          cloudFlavors: CloudFlavorsResolver,
          cloudImages: CloudImagesResolver,
          currentProjectInfo: CurrentProjectResolver,
          availabilityZones: AvailabilityZonesResolver
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule {}
