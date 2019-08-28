import { Observable } from 'rxjs/';
import { TerraformModuleWizardVarsProvider } from './../../../shared/terraform/terraform-module-wizard/terraform-module-wizard.component';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { PostgresqlDTO, TerraformPlanEvent } from '@dinivas/dto';

@Component({
  selector: 'dinivas-postgresql-wizard-vars',
  templateUrl: './postgresql-wizard-vars.component.html',
  styleUrls: ['./postgresql-wizard-vars.component.scss']
})
export class PostgresqlWizardVarsComponent
  implements OnInit, TerraformModuleWizardVarsProvider<PostgresqlDTO> {
  submitApplyPlan(moduleEntity: PostgresqlDTO) {}
  moduleServicePlan(moduleEntity: PostgresqlDTO): Observable<any> {
    return null;
  }
  moduleServiceApplyPlan(
    moduleEntity: PostgresqlDTO,
    terraformPlanEvent: TerraformPlanEvent<PostgresqlDTO>
  ): Observable<any> {
    return null;
  }
  moduleServiceTerraformState(moduleEntity: PostgresqlDTO): Observable<any> {
    return null;
  }
  terraformWebsocketEventId(moduleEntity: PostgresqlDTO): string {
    return null;
  }

  planApplied: EventEmitter<any>;

  applyApplied: EventEmitter<any>;

  constructor() {}

  ngOnInit() {}

  onPlan() {
    this.planApplied.emit('plan emited');
  }

  onApply() {
    this.applyApplied.emit('apply emited');
  }
}
