import { HttpParams } from '@angular/common/http';
import { CloudproviderService } from './../../shared/cloudprovider/cloudprovider.service';
import { ProjectsService } from './../../shared/project/projects.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ProjectDTO,
  CloudproviderDTO,
  ICloudApiProjectFloatingIpPool,
  ICloudApiProjectRouter,
  TerraformPlanEvent,
  ApplyProjectDTO
} from '@dinivas/dto';
import { TerraformWebSocket } from '../../shared/terraform/terraform-websocket.service';
import { MatVerticalStepper } from '@angular/material';

@Component({
  selector: 'dinivas-project-wizard',
  templateUrl: './project-wizard.component.html',
  styleUrls: ['./project-wizard.component.scss']
})
export class ProjectWizardComponent implements OnInit {
  project: ProjectDTO;
  projectForm: FormGroup;
  projectPlanFormGroup: FormGroup;
  cloudproviders: CloudproviderDTO[];
  availableFloatingIpPools: ICloudApiProjectFloatingIpPool[];
  availableRouters: ICloudApiProjectRouter[];
  loggingStack = 'graylog';
  isLinear = true;
  projectPlanStepFinished = false;
  projectApplyStepFinished = false;
  projectPlanInProgress = false;
  projectApplyInProgress = false;
  @ViewChild(MatVerticalStepper, { static: false })
  projectWizardStepper: MatVerticalStepper;
  terraformPlanEvent: TerraformPlanEvent;

  constructor(
    private formBuilder: FormBuilder,
    private projectService: ProjectsService,
    private readonly cloudproviderService: CloudproviderService,
    private readonly terraformWebSocket: TerraformWebSocket
  ) {}

  ngOnInit() {
    this.initProjectForm();
    this.projectPlanFormGroup = this.formBuilder.group({});
    this.cloudproviderService
      .getCloudproviders(new HttpParams())
      .subscribe((response: any) => {
        this.cloudproviders = response.items;
      });
  }

  initProjectForm() {
    this.projectForm = this.formBuilder.group({
      name: [this.project ? this.project.name : null, Validators.required],
      code: [this.project ? this.project.code : null, Validators.required],
      cloud_provider: [
        this.project ? this.project.cloud_provider : null,
        Validators.required
      ],
      description: [this.project ? this.project.description : null, null],
      public_router: [this.project ? this.project.public_router : null, null],
      floating_ip_pool: [
        this.project ? this.project.floating_ip_pool : null,
        null
      ],
      monitoring: [this.project ? this.project.monitoring : true, null],
      logging: [this.project ? this.project.logging : false, null]
    });
    this.projectForm.controls['cloud_provider'].patchValue(
      this.project ? this.project.cloud_provider : null,
      { onlySelf: true }
    );
    if (!this.project || (this.project && !this.project.cloud_provider)) {
      this.projectForm.get('floating_ip_pool').disable();
      this.projectForm.get('public_router').disable();
    }
    this.onChanges();
  }

  isFormValid(): boolean {
    return this.projectForm.valid;
  }

  submitPlanProject(project: ProjectDTO) {
    this.projectPlanInProgress = true;
    project.logging_stack = this.loggingStack;
    if (!this.project) {
      // create
      this.projectService.planProject(project).subscribe(() => {
        this.terraformWebSocket
          .receivePlanEvent(project.code)
          .subscribe((data: TerraformPlanEvent) => {
            console.log('Receive from Terrform WS', data);
            this.terraformPlanEvent = data;
            this.projectPlanInProgress = false;
            this.projectPlanStepFinished = true;
            setTimeout(() => {
              this.projectWizardStepper.next();
            }, 1);
          });
      });
    } else {
      // update
      project.id = this.project.id;
      this.projectService.updateProject(project).subscribe(() => {});
    }
  }

  submitApplyProjectPlan(project: ProjectDTO) {
    this.projectApplyInProgress = true;
    this.projectService.applyProjectPlan(
      new ApplyProjectDTO(project, this.terraformPlanEvent.workingDir)
    ).subscribe(()=>{
      this.terraformWebSocket
          .receiveApplyEvent(project.code)
          .subscribe((data: any) => {
            console.log('Receive from Terrform WS', data);
            this.projectApplyInProgress = false;
            this.projectApplyStepFinished = true;
            setTimeout(() => {
              this.projectWizardStepper.next();
            }, 1);
          });
    });
  }

  compareFn(
    cloudprovider1: CloudproviderDTO,
    cloudprovider2: CloudproviderDTO
  ) {
    return cloudprovider1 && cloudprovider2
      ? cloudprovider1.id === cloudprovider2.id
      : cloudprovider1 === cloudprovider2;
  }

  onChanges() {
    this.projectForm
      .get('cloud_provider')
      .valueChanges.subscribe((cloudprovider: CloudproviderDTO) => {
        if (cloudprovider) {
          this.projectForm.get('floating_ip_pool').reset();
          this.projectForm.get('public_router').reset();
          this.projectForm.get('floating_ip_pool').enable();
          this.projectForm.get('public_router').enable();
          this.cloudproviderService
            .getCloudProviderFloatingIps(cloudprovider.id)
            .subscribe(floatingIps => {
              this.availableFloatingIpPools = floatingIps;
              if (this.availableFloatingIpPools.length === 1) {
                this.projectForm.controls['floating_ip_pool'].patchValue(
                  this.availableFloatingIpPools[0].name
                );
              }
            });
          this.cloudproviderService
            .getCloudProviderRouters(cloudprovider.id)
            .subscribe(routers => {
              this.availableRouters = routers;
              if (this.availableRouters.length === 1) {
                this.projectForm.controls['public_router'].patchValue(
                  this.availableRouters[0].name
                );
              }
            });
        } else {
          this.projectForm.get('floating_ip_pool').reset();
          this.projectForm.get('public_router').reset();
          this.projectForm.get('floating_ip_pool').disable();
          this.projectForm.get('public_router').disable();
        }
      });
  }
}
