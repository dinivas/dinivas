import { Observable } from 'rxjs/';
import { GitlabDTO, TerraformPlanEvent } from '@dinivas/dto';
import { TerraformModuleWizardVarsProvider } from './../../../shared/terraform/terraform-module-wizard/terraform-module-wizard.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dinivas-gitlab-wizard',
  templateUrl: './gitlab-wizard.component.html',
  styleUrls: ['./gitlab-wizard.component.scss']
})
export class GitlabWizardComponent
  implements OnInit, TerraformModuleWizardVarsProvider<GitlabDTO> {
  constructor() {}

  ngOnInit() {}

  submitApplyPlan: (moduleEntity: GitlabDTO) => void;
  moduleServicePlan: (moduleEntity: GitlabDTO) => Observable<any>;
  moduleServiceApplyPlan: (
    moduleEntity: GitlabDTO,
    terraformPlanEvent: TerraformPlanEvent<GitlabDTO>
  ) => Observable<any>;
  moduleServiceTerraformState: (moduleEntity: GitlabDTO) => Observable<any>;
  terraformWebsocketEventId: (moduleEntity: GitlabDTO) => string;
}
