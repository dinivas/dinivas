import { PostgresqlWizardVarsComponent } from './postgresql-wizard-vars/postgresql-wizard-vars.component';
import { PostgresqlComponent } from './postgresql.component';
import { MandatorySelectedProjectGuard } from './../../core/guards/mandatory-selected-project/mandatory-selected-project.guard';
import { TerraformModuleWizardComponent } from './../../shared/terraform/terraform-module-wizard/terraform-module-wizard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostgresqlDTO } from '@dinivas/dto';

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
      component: PostgresqlWizardVarsComponent,
      backButtonRouterLink: ['/storage', 'postgresql'],
      moduleEntity: undefined,
      moduleEntityName: 'Postgresql',
      moduleLabel: 'Postgresql'
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
