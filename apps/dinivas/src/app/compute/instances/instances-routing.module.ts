import { CurrentInstanceResolver } from './../../shared/compute/instances.resolver';
import { InstanceStatusComponent } from './instance-status/instance-status.component';
import { InstanceViewComponent } from './instance-view.component';
import { CurrentProjectResolver } from './../../shared/project/current-project.resolver';
import { CloudImagesResolver } from './../../shared/cloudprovider/cloud-images.resolver';
import { CloudFlavorsResolver } from './../../shared/cloudprovider/cloud-flavors.resolver';
import { MandatorySelectedProjectGuard } from './../../core/guards/mandatory-selected-project/mandatory-selected-project.guard';
import { TerraformModuleWizardComponent } from './../../shared/terraform/terraform-module-wizard/terraform-module-wizard.component';
import { InstanceWizardComponent } from './instance-wizard/instance-wizard.component';
import { TerraformModuleWizard } from './../../shared/terraform/terraform-module-wizard/terraform-module-wizard';
import { InstancesComponent } from './instances.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InstanceDTO } from '@dinivas/api-interfaces';

const moduleWizardData = new TerraformModuleWizard<InstanceDTO>(
  InstanceWizardComponent,
  ['/compute', 'instances'],
  undefined,
  'Instance',
  'Instance',
  false,
  false,
  false,
  false
);

const routes: Routes = [
  { path: '', component: InstancesComponent },
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
    path: ':instanceId',
    component: InstanceViewComponent,
    resolve: {
      currentInstanceInfo: CurrentInstanceResolver
    },
    children: [
      {
        path: 'status',
        component: InstanceStatusComponent,
        resolve: {
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
          moduleEntity: CurrentInstanceResolver,
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
export class InstancesRoutingModule {}
