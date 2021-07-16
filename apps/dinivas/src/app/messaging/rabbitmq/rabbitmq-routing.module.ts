import { CurrentRabbitMQResolver } from './../../shared/rabbitmq/rabbitmq.resolver';
import { RabbitmqStatusComponent } from './rabbitmq-status/rabbitmq-status.component';
import { CurrentProjectResolver } from './../../shared/project/current-project.resolver';
import { CloudImagesResolver } from './../../shared/cloudprovider/cloud-images.resolver';
import { CloudFlavorsResolver } from './../../shared/cloudprovider/cloud-flavors.resolver';
import { MandatorySelectedProjectGuard } from './../../core/guards/mandatory-selected-project/mandatory-selected-project.guard';
import { TerraformModuleWizardComponent } from './../../shared/terraform/terraform-module-wizard/terraform-module-wizard.component';
import { RabbitmqWizardComponent } from './rabbitmq-wizard/rabbitmq-wizard.component';
import { RabbitmqComponent } from './rabbitmq.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RabbitMQDTO } from '@dinivas/api-interfaces';
import { TerraformModuleWizard } from '../../shared/terraform/terraform-module-wizard/terraform-module-wizard';
import { RabbitMQViewComponent } from './rabbitmq-view.component';
import { RabbitMQResolver } from '../../shared/rabbitmq/rabbitmq.resolver';

const moduleWizardData = new TerraformModuleWizard<RabbitMQDTO>(
  RabbitmqWizardComponent,
  ['/messaging', 'rabbitmq'],
  undefined,
  'RabbitMQ',
  'RabbitMQ',
  true,
  false,
  false,
  false
);

const routes: Routes = [
  {
    path: '',
    component: RabbitmqComponent,
    resolve: {
      rabbitMQPage: RabbitMQResolver
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
    path: ':rabbitMQId',
    component: RabbitMQViewComponent,
    resolve: {
      currentRabbitmqInfo: CurrentRabbitMQResolver
    },
    children: [
      {
        path: 'status',
        component: RabbitmqStatusComponent,
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
          moduleEntity: CurrentRabbitMQResolver,
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
export class RabbitmqRoutingModule {}
