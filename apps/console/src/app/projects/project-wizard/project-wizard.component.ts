import { SelectProjectDialogComponent } from './../../core/dialog/select-project-dialog/select-project-dialog.component';
import { ContextualMenuService } from './../../core/contextual-menu/contextual-menu.service';
import { Observable } from 'rxjs/';
import { ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { CloudproviderService } from './../../shared/cloudprovider/cloudprovider.service';
import { ProjectsService } from './../../shared/project/projects.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl
} from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ProjectDTO,
  CloudproviderDTO,
  ICloudApiProjectFloatingIpPool,
  ICloudApiProjectRouter,
  TerraformPlanEvent,
  TerraformApplyEvent,
  ICloudApiImage,
  ICloudApiFlavor,
  ApplyModuleDTO
} from '@dinivas/dto';
import { TerraformWebSocket } from '../../shared/terraform/terraform-websocket.service';
import { MatVerticalStepper } from '@angular/material';
import { filter, flatMap, toArray, map } from 'rxjs/operators';

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
  terraformPlanEvent: TerraformPlanEvent<ProjectDTO>;
  terraformApplyEvent: TerraformApplyEvent<ProjectDTO>;
  terraformStateOutputs: any[];
  shouldShowSensitiveData: any = {};
  showingDirectOutput = false;
  cloudImages: ICloudApiImage[];
  cloudFlavors: ICloudApiFlavor[];

  constructor(
    private formBuilder: FormBuilder,
    private projectService: ProjectsService,
    private readonly cloudproviderService: CloudproviderService,
    private readonly terraformWebSocket: TerraformWebSocket,
    private activatedRoute: ActivatedRoute,
    private contextualMenuService: ContextualMenuService
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
    this.activatedRoute.data
      .pipe(
        map(
          (data: {
            currentProjectInfo: { project: ProjectDTO; projectState: any };
          }) => data.currentProjectInfo
        )
      )
      .subscribe((projectInfo: { project: ProjectDTO; projectState: any }) => {
        this.project = projectInfo.project;
        this.initProjectForm();
      });
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
      management_subnet_cidr: [
        this.project ? this.project.management_subnet_cidr : '10.10.11.0/24',
        null
      ],
      floating_ip_pool: [
        this.project ? this.project.floating_ip_pool : null,
        null
      ],
      monitoring: [this.project ? this.project.monitoring : false, null],
      logging: [this.project ? this.project.logging : false, null],
      bastion_cloud_image: [
        this.project ? this.project.bastion_cloud_image : null,
        Validators.required
      ],
      bastion_cloud_flavor: [
        this.project ? this.project.bastion_cloud_flavor : null,
        Validators.required
      ],
      enable_proxy: [this.project ? this.project.enable_proxy : false, null],
      proxy_cloud_flavor: [
        this.project ? this.project.proxy_cloud_flavor : null,
        null
      ],
      prometheus_cloud_flavor: [
        this.project ? this.project.prometheus_cloud_flavor : null
      ]
    });
    if (this.project && this.project.code) {
      this.projectForm.get('code').disable();
    }
    this.onCloudProviderChanges();
    this.projectForm.controls['cloud_provider'].patchValue(
      this.project ? this.project.cloud_provider : null,
      { onlySelf: true }
    );
    if (!this.project || (this.project && !this.project.cloud_provider)) {
      this.projectForm.get('floating_ip_pool').disable();
      this.projectForm.get('public_router').disable();
    }
    this.setMonitoringValidators();
    this.setProxyValidators();
  }

  isFormValid(): boolean {
    return this.projectForm && this.projectForm.valid;
  }

  submitPlanProject(project: ProjectDTO) {
    this.projectPlanInProgress = true;
    this.projectPlanStepFinished = false;
    if (!project['code'] && this.project) {
      // Set code because formbuilder has exclude it
      project.code = this.project.code;
    }
    project.logging_stack = this.loggingStack;
    if (!this.project) {
      this.planProject(project);
    } else {
      project.id = this.project.id;
      this.planProject(project);
    }
  }

  planProject(project: ProjectDTO) {
    this.projectService.planProject(project).subscribe(
      () => {
        this.terraformWebSocket
          .receivePlanEvent(project.code)
          .subscribe((data: TerraformPlanEvent<ProjectDTO>) => {
            console.log('Receive TerraformPlanEvent from Terrform WS', data);
            this.terraformPlanEvent = data;
            this.projectPlanInProgress = false;
            this.projectPlanStepFinished = true;
            setTimeout(() => {
              this.projectWizardStepper.next();
            }, 1);
          });
      },
      error => {
        this.projectPlanInProgress = false;
        this.projectPlanStepFinished = false;
      }
    );
  }

  submitApplyProjectPlan(project: ProjectDTO) {
    this.projectApplyInProgress = true;
    if (!this.project) {
      // create
      this.projectService
        .createProject(project)
        .subscribe((savedProject: ProjectDTO) => {
          this.applyProject(savedProject);
        });
    } else {
      // update
      project.id = this.project.id;
      this.projectService
        .updateProject(project)
        .subscribe((savedProject: ProjectDTO) => {
          this.applyProject(savedProject);
        });
    }
  }

  applyProject(project: ProjectDTO) {
    this.projectService
      .applyProjectPlan(
        new ApplyModuleDTO<ProjectDTO>(
          project,
          this.terraformPlanEvent.workingDir
        )
      )
      .subscribe(
        () => {
          this.terraformWebSocket
            .receiveApplyEvent(project.code)
            .subscribe((data: TerraformApplyEvent<ProjectDTO>) => {
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

              this.projectApplyInProgress = false;
              this.projectApplyStepFinished = true;
              setTimeout(() => {
                this.projectWizardStepper.next();
              }, 1);
            });
        },
        error => {
          this.projectApplyInProgress = false;
          this.projectApplyStepFinished = false;
        }
      );
  }

  showProjectOutput() {
    this.projectPlanStepFinished = true;
    this.projectApplyStepFinished = true;
    this.showingDirectOutput = true;
    this.projectService
      .getProjectTerraformState(this.project.id)
      .subscribe(state => (this.terraformStateOutputs = state.outputs));
    setTimeout(() => (this.projectWizardStepper.selectedIndex = 2), 1);
  }

  compareFn(
    cloudprovider1: CloudproviderDTO,
    cloudprovider2: CloudproviderDTO
  ) {
    return cloudprovider1 && cloudprovider2
      ? cloudprovider1.id === cloudprovider2.id
      : cloudprovider1 === cloudprovider2;
  }

  setMonitoringValidators() {
    const prometheusFlavor: AbstractControl = this.projectForm.get(
      'prometheus_cloud_flavor'
    );
    this.projectForm
      .get('monitoring')
      .valueChanges.subscribe((isMonitoringEnabled: boolean) => {
        if (isMonitoringEnabled) {
          prometheusFlavor.setValidators([Validators.required]);
        } else {
          prometheusFlavor.setValidators(null);
        }
        prometheusFlavor.updateValueAndValidity();
      });
  }

  setProxyValidators() {
    const proxyFlavor: AbstractControl = this.projectForm.get(
      'proxy_cloud_flavor'
    );
    this.projectForm
      .get('enable_proxy')
      .valueChanges.subscribe((isMonitoringEnabled: boolean) => {
        if (isMonitoringEnabled) {
          proxyFlavor.setValidators([Validators.required]);
        } else {
          proxyFlavor.setValidators(null);
        }
        proxyFlavor.updateValueAndValidity();
      });
  }

  addSSHKey() {
    this.contextualMenuService.openComponentInContextualMenu(
      SelectProjectDialogComponent
    );
  }

  onCloudProviderChanges() {
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
              if (this.project && this.project.floating_ip_pool) {
                this.projectForm.controls['floating_ip_pool'].patchValue(
                  this.project.floating_ip_pool
                );
              } else if (this.availableFloatingIpPools.length === 1) {
                this.projectForm.controls['floating_ip_pool'].patchValue(
                  this.availableFloatingIpPools[0].name
                );
              }
            });
          this.cloudproviderService
            .getCloudProviderRouters(cloudprovider.id)
            .subscribe(routers => {
              this.availableRouters = routers;
              if (this.project && this.project.public_router) {
                this.projectForm.controls['public_router'].patchValue(
                  this.project.public_router
                );
              } else if (this.availableRouters.length === 1) {
                this.projectForm.controls['public_router'].patchValue(
                  this.availableRouters[0].name
                );
              }
            });

          if (!this.project) {
            this.cloudproviderService
              .getCloudProviderFlavors(cloudprovider.id)
              .pipe(
                flatMap(t => t),
                filter(flavor => flavor.name.indexOf('dinivas') > -1),
                toArray(),
                map(items =>
                  items.sort((a, b) => {
                    return a.vcpus - b.vcpus;
                  })
                )
              )
              .subscribe(cloudFlavors => {
                this.cloudFlavors = cloudFlavors;
              });
          }

          if (!this.project) {
            this.cloudproviderService
              .getCloudProviderImages(cloudprovider.id)
              .pipe(
                flatMap(t => t),
                filter(img => img.tags.indexOf('dinivas') > -1),
                toArray()
              )
              .subscribe(cloudImages => {
                this.cloudImages = cloudImages;
                this.projectForm
                  .get('bastion_cloud_image')
                  .patchValue(
                    this.cloudImages.find(img => img.tags.indexOf(' base') > -1)
                      .name
                  );
              });
          }

          if (this.project && this.project.prometheus_cloud_flavor) {
            this.projectForm
              .get('prometheus_cloud_flavor')
              .patchValue(this.project.prometheus_cloud_flavor);
          }
          if (this.project && this.project.bastion_cloud_flavor) {
            this.projectForm
              .get('bastion_cloud_flavor')
              .patchValue(this.project.bastion_cloud_flavor);
          }

          if (this.project && this.project.bastion_cloud_image) {
            this.projectForm
              .get('bastion_cloud_image')
              .patchValue(this.project.bastion_cloud_image);
          }
        } else {
          this.projectForm.get('floating_ip_pool').reset();
          this.projectForm.get('public_router').reset();
          this.projectForm.get('floating_ip_pool').disable();
          this.projectForm.get('public_router').disable();
        }
      });
  }
}
