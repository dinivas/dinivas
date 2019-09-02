import { TerraformModuleWizardVarsProvider } from './../../../shared/terraform/terraform-module-wizard/terraform-module-wizard.component';
import { TerraformWebSocket } from './../../../shared/terraform/terraform-websocket.service';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { JenkinsService } from './../../../shared/jenkins/jenkins.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  JenkinsDTO,
  ICloudApiImage,
  ICloudApiFlavor,
  TerraformPlanEvent,
  TerraformApplyEvent,
  ApplyModuleDTO
} from '@dinivas/dto';
import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { MatVerticalStepper } from '@angular/material';
import { Observable } from 'rxjs';

@Component({
  selector: 'dinivas-jenkins-wizard',
  templateUrl: './jenkins-wizard.component.html',
  styleUrls: ['./jenkins-wizard.component.scss']
})
export class JenkinsWizardComponent
  implements OnInit, TerraformModuleWizardVarsProvider<JenkinsDTO> {
  jenkins: JenkinsDTO;
  jenkinsForm: FormGroup;
  jenkinsPlanStepFinished = false;
  jenkinsApplyStepFinished = false;
  jenkinsPlanInProgress = false;
  jenkinsApplyInProgress = false;
  @ViewChild(MatVerticalStepper, { static: false })
  jenkinsWizardStepper: MatVerticalStepper;
  cloudImages: ICloudApiImage[];
  cloudFlavors: ICloudApiFlavor[];
  terraformPlanEvent: TerraformPlanEvent<JenkinsDTO>;
  terraformApplyEvent: TerraformApplyEvent<JenkinsDTO>;
  terraformStateOutputs: any[];
  shouldShowSensitiveData: any = {};
  showingDirectOutput = false;

  architectureType: string;
  planApplied: EventEmitter<any>;

  applyApplied: EventEmitter<any>;
  onArchitectureTypeChanged: EventEmitter<any>;

  constructor(
    private formBuilder: FormBuilder,
    private jenkinsService: JenkinsService,
    private readonly terraformWebSocket: TerraformWebSocket,
    private activatedRoute: ActivatedRoute
  ) {
    activatedRoute.data
      .pipe(
        map((data: { cloudFlavors: ICloudApiFlavor[] }) => data.cloudFlavors)
      )
      .subscribe(
        (cloudFlavors: ICloudApiFlavor[]) => (this.cloudFlavors = cloudFlavors)
      );
    activatedRoute.data
      .pipe(map((data: { cloudImages: ICloudApiImage[] }) => data.cloudImages))
      .subscribe(
        (cloudImages: ICloudApiImage[]) => (this.cloudImages = cloudImages)
      );
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      const jenkinsId = params['jenkinsId'];
      if (jenkinsId) {
        this.jenkinsService.getOne(jenkinsId).subscribe(jenkins => {
          this.jenkins = jenkins;
          this.initJenkinsForm();
        });
      } else {
        this.initJenkinsForm();
      }
    });
    this.onArchitectureTypeChanged.subscribe(
      (architectureType: string) => (this.architectureType = architectureType)
    );
  }
  initJenkinsForm() {
    this.jenkinsForm = this.formBuilder.group({
      code: [this.jenkins ? this.jenkins.code : null, Validators.required],
      description: [this.jenkins ? this.jenkins.description : null, null],
      master_cloud_image: [
        this.jenkins ? this.jenkins.master_cloud_image : null,
        Validators.required
      ],
      master_cloud_flavor: [
        this.jenkins ? this.jenkins.master_cloud_flavor : null,
        Validators.required
      ],
      use_floating_ip: [
        this.jenkins ? this.jenkins.use_floating_ip : false,
        null
      ]
    });
  }

  isFormValid(): boolean {
    return this.jenkinsForm && this.jenkinsForm.valid;
  }

  moduleServicePlan(moduleEntity: JenkinsDTO): Observable<any> {
    return this.jenkinsService.plan(moduleEntity);
  }

  submitApplyPlan: (moduleEntity: JenkinsDTO) => void;

  submitPlanJenkins(jenkins: JenkinsDTO) {
    this.jenkinsPlanInProgress = true;
    this.jenkinsPlanStepFinished = false;
    if (!jenkins['code'] && this.jenkins) {
      // Set code because formbuilder has exclude it
      jenkins.code = this.jenkins.code;
    }
    if (!this.jenkins) {
      this.planApplied.emit(jenkins);
    } else {
      jenkins.id = this.jenkins.id;
      this.planApplied.emit(jenkins);
    }
  }

  moduleServiceApplyPlan(
    moduleEntity: JenkinsDTO,
    terraformPlanEvent: TerraformPlanEvent<JenkinsDTO>
  ): Observable<any> {
    return this.jenkinsService.applyPlan(moduleEntity);
  }

  submitApplyJenkinsPlan(jenkins: JenkinsDTO) {
    this.jenkinsApplyInProgress = true;
    if (!this.jenkins) {
      // create
      this.jenkinsService
        .create(jenkins)
        .subscribe((savedJenkins: JenkinsDTO) => {
          this.applyApplied.emit(savedJenkins);
        });
    } else {
      // update
      jenkins.id = this.jenkins.id;
      this.jenkinsService
        .update(jenkins)
        .subscribe((savedJenkins: JenkinsDTO) => {
          this.applyApplied.emit(savedJenkins);
        });
    }
  }

  terraformWebsocketEventId(moduleEntity: JenkinsDTO): string {
    return moduleEntity.code;
  }

  moduleServiceTerraformState(moduleEntity: JenkinsDTO): Observable<any> {
    return this.jenkinsService.getTerraformState(moduleEntity.id);
  }
}
