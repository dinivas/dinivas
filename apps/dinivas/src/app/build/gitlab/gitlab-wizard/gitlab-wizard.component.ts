import { Observable } from 'rxjs';
import { GitlabDTO } from '@dinivas/api-interfaces';
import { TerraformModuleWizardVarsProvider } from './../../../shared/terraform/terraform-module-wizard/terraform-module-wizard.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dinivas-gitlab-wizard',
  templateUrl: './gitlab-wizard.component.html',
  styleUrls: ['./gitlab-wizard.component.scss'],
})
export class GitlabWizardComponent
  implements OnInit, TerraformModuleWizardVarsProvider<GitlabDTO>
{
  constructor() {}
  submitApplyPlan: (moduleEntity: GitlabDTO) => void;
  moduleServicePlan: (
    moduleEntity: GitlabDTO
  ) => Observable<{ planJobId: number }>;
  moduleServiceApplyPlan: (
    moduleEntity: GitlabDTO
  ) => Observable<{ applyJobId: number }>;
  moduleServiceTerraformState: (moduleEntity: GitlabDTO) => Observable<any>;
  terraformWebsocketEventId: (moduleEntity: GitlabDTO) => string;

  ngOnInit() {}
}
