import { CloudImagesResolver } from './../../shared/cloudprovider/cloud-images.resolver';
import { CloudFlavorsResolver } from './../../shared/cloudprovider/cloud-flavors.resolver';
import { PostgresqlWizardVarsComponent } from './postgresql-wizard-vars/postgresql-wizard-vars.component';
import { PostgresqlComponent } from './postgresql.component';
import { MandatorySelectedProjectGuard } from './../../core/guards/mandatory-selected-project/mandatory-selected-project.guard';
import { TerraformModuleWizardComponent } from './../../shared/terraform/terraform-module-wizard/terraform-module-wizard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostgresqlDTO } from '@dinivas/dto';
import { TerraformModuleWizard } from '../../shared/terraform/terraform-module-wizard/terraform-module-wizard';

const moduleWizardData = new TerraformModuleWizard<PostgresqlDTO>(
  PostgresqlWizardVarsComponent,
  ['/storage', 'postgresql'],
  undefined,
  'Postgresql',
  'Postgresql',
  true,
  true,
  true,
  true
);

const routes: Routes = [
  {
    path: '',
    component: PostgresqlComponent
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
      cloudImages: CloudImagesResolver
    }
  },
  {
    path: 'edit/:postgresqlId',
    component: TerraformModuleWizardComponent,
    canActivate: [MandatorySelectedProjectGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostgresqlRoutingModule {}
