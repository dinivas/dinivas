import { ConsulStatusComponent } from './consul-status/consul-status.component';
import { ConsulViewComponent } from './consul-view.component';
import { CurrentProjectResolver } from './../../shared/project/current-project.resolver';
import { CloudImagesResolver } from './../../shared/cloudprovider/cloud-images.resolver';
import { CloudFlavorsResolver } from './../../shared/cloudprovider/cloud-flavors.resolver';
import { MandatorySelectedProjectGuard } from './../../core/guards/mandatory-selected-project/mandatory-selected-project.guard';
import { TerraformModuleWizardComponent } from './../../shared/terraform/terraform-module-wizard/terraform-module-wizard.component';
import { ConsulWizardComponent } from './consul-wizard/consul-wizard.component';
import { TerraformModuleWizard } from './../../shared/terraform/terraform-module-wizard/terraform-module-wizard';
import { ConsulDTO } from '@dinivas/dto';
import { ConsulComponent } from './consul.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsulResolver } from './../../shared/consul/consul.resolver';
import { CurrentConsulResolver } from '../../shared/consul/consul.resolver';

const moduleWizardData = new TerraformModuleWizard<ConsulDTO>(
  ConsulWizardComponent,
  ['/network', 'consul'],
  undefined,
  'Consul',
  'Consul',
  true,
  false,
  false,
  false
);

const routes: Routes = [
  {
    path: '',
    component: ConsulComponent,
    resolve: {
      consulPage: ConsulResolver
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
    path: ':consulId',
    component: ConsulViewComponent,
    resolve: {
      currentConsulInfo: CurrentConsulResolver
    },
    children: [
      {
        path: 'status',
        component: ConsulStatusComponent
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
          moduleEntity: CurrentConsulResolver,
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
export class ConsulRoutingModule {}
