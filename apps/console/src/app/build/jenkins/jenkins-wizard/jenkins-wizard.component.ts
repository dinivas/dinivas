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
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatVerticalStepper } from '@angular/material';

@Component({
  selector: 'dinivas-jenkins-wizard',
  templateUrl: './jenkins-wizard.component.html',
  styleUrls: ['./jenkins-wizard.component.scss']
})
export class JenkinsWizardComponent implements OnInit {
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

  submitPlanJenkins(jenkins: JenkinsDTO) {
    this.jenkinsPlanInProgress = true;
    this.jenkinsPlanStepFinished = false;
    if (!jenkins['code'] && this.jenkins) {
      // Set code because formbuilder has exclude it
      jenkins.code = this.jenkins.code;
    }
    if (!this.jenkins) {
      this.planJenkins(jenkins);
    } else {
      jenkins.id = this.jenkins.id;
      this.planJenkins(jenkins);
    }
  }

  planJenkins(jenkins: JenkinsDTO) {
    this.jenkinsService.planJenkins(jenkins).subscribe(
      () => {
        this.terraformWebSocket
          .receivePlanEvent(jenkins.code)
          .subscribe((data: TerraformPlanEvent<JenkinsDTO>) => {
            console.log('Receive TerraformPlanEvent from Terrform WS', data);
            this.terraformPlanEvent = data;
            this.jenkinsPlanInProgress = false;
            this.jenkinsPlanStepFinished = true;
            setTimeout(() => {
              this.jenkinsWizardStepper.next();
            }, 1);
          });
      },
      error => {
        this.jenkinsPlanInProgress = false;
        this.jenkinsPlanStepFinished = false;
      }
    );
  }

  submitApplyJenkinsPlan(jenkins: JenkinsDTO) {
    this.jenkinsApplyInProgress = true;
    if (!this.jenkins) {
      // create
      this.jenkinsService
        .createJenkins(jenkins)
        .subscribe((savedJenkins: JenkinsDTO) => {
          this.applyJenkins(savedJenkins);
        });
    } else {
      // update
      jenkins.id = this.jenkins.id;
      this.jenkinsService
        .updateJenkins(jenkins)
        .subscribe((savedJenkins: JenkinsDTO) => {
          this.applyJenkins(savedJenkins);
        });
    }
  }

  applyJenkins(jenkins: JenkinsDTO) {
    this.jenkinsService
      .applyJenkinsPlan(
        new ApplyModuleDTO<JenkinsDTO>(jenkins, this.terraformPlanEvent.workingDir)
      )
      .subscribe(
        () => {
          this.terraformWebSocket
            .receiveApplyEvent(jenkins.code)
            .subscribe((data: TerraformApplyEvent<JenkinsDTO>) => {
              console.log('Receive TerraformApplyEvent from Terrform WS', data);
              this.terraformApplyEvent = data;
              this.terraformStateOutputs = this.terraformApplyEvent.stateResult.values.outputs;
              for (const [key, value] of Object.entries(
                this.terraformApplyEvent.stateResult.values.outputs
              )) {
                this.shouldShowSensitiveData[key] = this.terraformApplyEvent
                  .stateResult.values.outputs[key].sensitive
                  ? false
                  : true;
              }

              this.jenkinsApplyInProgress = false;
              this.jenkinsApplyStepFinished = true;
              setTimeout(() => {
                this.jenkinsWizardStepper.next();
              }, 1);
            });
        },
        error => {
          this.jenkinsApplyInProgress = false;
          this.jenkinsApplyStepFinished = false;
        }
      );
  }

  showJenkinsOutput() {
    this.jenkinsPlanStepFinished = true;
    this.jenkinsApplyStepFinished = true;
    this.showingDirectOutput = true;
    this.jenkinsService
      .getJenkinsTerraformState(this.jenkins.id)
      .subscribe(state => (this.terraformStateOutputs = state.outputs));
    setTimeout(() => (this.jenkinsWizardStepper.selectedIndex = 2), 1);
  }
}
