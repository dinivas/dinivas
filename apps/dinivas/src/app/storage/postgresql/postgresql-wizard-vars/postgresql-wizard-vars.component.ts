import { PostgresqlService } from './../../../shared/postgresql/postgresql.service';
import { Observable } from 'rxjs';
import { TerraformModuleWizardVarsProvider } from './../../../shared/terraform/terraform-module-wizard/terraform-module-wizard.component';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { PostgresqlDTO, TerraformPlanEvent } from '@dinivas/api-interfaces';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'dinivas-postgresql-wizard-vars',
  templateUrl: './postgresql-wizard-vars.component.html',
  styleUrls: ['./postgresql-wizard-vars.component.scss']
})
export class PostgresqlWizardVarsComponent
  implements OnInit, TerraformModuleWizardVarsProvider<PostgresqlDTO> {
  architectureType: string;
  postgresql: PostgresqlDTO;
  postgresqlForm: FormGroup;

  planApplied: EventEmitter<any>;

  applyApplied: EventEmitter<any>;
  onArchitectureTypeChanged: EventEmitter<any>;

  constructor(
    private formBuilder: FormBuilder,
    private postgresqlService: PostgresqlService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      const postgresqlId = params['postgresqlId'];
      if (postgresqlId) {
        this.postgresqlService.getOne(postgresqlId).subscribe(postgresql => {
          this.postgresql = postgresql;
          this.initPostgresqlForm();
        });
      } else {
        this.initPostgresqlForm();
      }
    });
    this.onArchitectureTypeChanged.subscribe(
      (architectureType: string) => (this.architectureType = architectureType)
    );
  }

  initPostgresqlForm() {
    this.postgresqlForm = this.formBuilder.group({
      code: [this.postgresql ? this.postgresql.code : null, Validators.required]
    });
  }

  submitApplyPlan(moduleEntity: PostgresqlDTO) {}
  moduleServicePlan(moduleEntity: PostgresqlDTO): Observable<any> {
    return this.postgresqlService.plan(moduleEntity);
  }
  moduleServiceApplyPlan(
    moduleEntity: PostgresqlDTO,
    terraformPlanEvent: TerraformPlanEvent<PostgresqlDTO>
  ): Observable<any> {
    return this.postgresqlService.applyPlan(moduleEntity);
  }
  moduleServiceTerraformState(moduleEntity: PostgresqlDTO): Observable<any> {
    return this.postgresqlService.getTerraformState(moduleEntity.id);
  }
  terraformWebsocketEventId(moduleEntity: PostgresqlDTO): string {
    return moduleEntity.code;
  }

  onApply() {
    this.applyApplied.emit('apply emited');
  }

  isFormValid(): boolean {
    return this.postgresqlForm && this.postgresqlForm.valid;
  }

  submitPlanPostgresql(postgresql: PostgresqlDTO) {
    this.planApplied.emit(postgresql);
  }
}
