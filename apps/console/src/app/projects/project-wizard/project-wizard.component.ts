import { ConsulService } from './../../shared/consul/consul.service';
import { AlertService } from './../../core/alert/alert.service';
import { SelectProjectDialogComponent } from './../../core/dialog/select-project-dialog/select-project-dialog.component';
import { ContextualMenuService } from './../../core/contextual-menu/contextual-menu.service';
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
  ApplyModuleDTO,
  ICloudApiAvailabilityZone,
  ConsulDTO,
  ProjectDefinitionDTO
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
  consul: ConsulDTO;
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
  availabilityZones: ICloudApiAvailabilityZone[];

  constructor(
    private formBuilder: FormBuilder,
    private projectService: ProjectsService,
    private consulService: ConsulService,
    private readonly cloudproviderService: CloudproviderService,
    private readonly terraformWebSocket: TerraformWebSocket,
    private activatedRoute: ActivatedRoute,
    private contextualMenuService: ContextualMenuService,
    private alertService: AlertService
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
    activatedRoute.data
      .pipe(
        map(
          (data: { availabilityZones: ICloudApiAvailabilityZone[] }) =>
            data.availabilityZones
        )
      )
      .subscribe(
        (availabilityZones: ICloudApiAvailabilityZone[]) =>
          (this.availabilityZones = availabilityZones)
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
      .subscribe(
        async (projectInfo: { project: ProjectDTO; projectState: any }) => {
          this.project = projectInfo && projectInfo.project;
          if (this.project) {
            this.consul = await this.consulService
              .getOneByCode(this.project.code)
              .toPromise();
          }
          this.initProjectForm();
        }
      );
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
      root_domain: [this.project ? this.project.root_domain : null, null],
      description: [this.project ? this.project.description : null, null],
      availability_zone: [
        this.project ? this.project.availability_zone : null,
        Validators.required
      ],
      public_router: [this.project ? this.project.public_router : null, null],
      management_subnet_cidr: [
        this.project ? this.project.management_subnet_cidr : '10.10.11.0/24',
        null
      ],
      management_subnet_dhcp_allocation_start: [
        this.project
          ? this.project.management_subnet_dhcp_allocation_start
          : '10.10.11.2'
      ],
      management_subnet_dhcp_allocation_end: [
        this.project
          ? this.project.management_subnet_dhcp_allocation_end
          : '10.10.11.254'
      ],
      floating_ip_pool: [
        this.project ? this.project.floating_ip_pool : null,
        null
      ],
      monitoring: [this.project ? this.project.monitoring : false, null],
      logging: [this.project ? this.project.logging : false, null],
      _bastion_cloud_image: [
        this.project ? this.project.bastion_cloud_image : null,
        Validators.required
      ],
      _bastion_cloud_flavor: [
        this.project ? this.project.bastion_cloud_flavor : null,
        Validators.required
      ],
      enable_proxy: [this.project ? this.project.enable_proxy : false, null],
      _proxy_cloud_flavor: [
        this.project ? this.project.proxy_cloud_flavor : null,
        null
      ],
      keycloak_host: [
        this.project ? this.project.keycloak_host : null,
        Validators.required
      ],
      keycloak_client_id: [
        this.project ? this.project.keycloak_client_id : null,
        Validators.required
      ],
      keycloak_client_secret: [
        this.project ? this.project.keycloak_client_secret : null,
        Validators.required
      ],
      _prometheus_cloud_flavor: [
        this.project ? this.project.prometheus_cloud_flavor : null
      ],
      _consul: this.formBuilder.group({
        cluster_domain: [
          this.consul ? this.consul.cluster_domain : 'consul',
          Validators.required
        ],
        cluster_datacenter: [
          this.consul ? this.consul.cluster_datacenter : null,
          Validators.required
        ],
        server_instance_count: [
          this.consul ? this.consul.server_instance_count : 1,
          Validators.required
        ],
        client_instance_count: [
          this.consul ? this.consul.client_instance_count : 1,
          Validators.required
        ]
      })
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
      this.projectForm.get('availability_zone').disable();
      this.projectForm.get('floating_ip_pool').disable();
      this.projectForm.get('public_router').disable();
    }
    this.setMonitoringValidators();
    this.setProxyValidators();
  }

  isFormValid(): boolean {
    return this.projectForm && this.projectForm.valid;
  }

  prepareProjectFormValueBeforeSendToServer(
    project: ProjectDTO,
    consul: ConsulDTO
  ) {
    // Set bastion image name
    if (project && this.projectForm.get('_bastion_cloud_image').value) {
      project.bastion_cloud_image = (this.projectForm.get(
        '_bastion_cloud_image'
      ).value as ICloudApiImage).name;
      delete project['_bastion_cloud_image'];
    }
    // Set bastion image name
    if (project && this.projectForm.get('_bastion_cloud_flavor').value) {
      project.bastion_cloud_flavor = (this.projectForm.get(
        '_bastion_cloud_flavor'
      ).value as ICloudApiFlavor).name;
      delete project['_bastion_cloud_flavor'];
    }

    // Set proxy flavor name
    if (project && this.projectForm.get('_proxy_cloud_flavor').value) {
      project.proxy_cloud_flavor = (this.projectForm.get('_proxy_cloud_flavor')
        .value as ICloudApiFlavor).name;
      delete project['_proxy_cloud_flavor'];
    }

    // Set prometheus flavor name
    if (project && this.projectForm.get('_prometheus_cloud_flavor').value) {
      project.bastion_cloud_flavor = (this.projectForm.get(
        '_prometheus_cloud_flavor'
      ).value as ICloudApiFlavor).name;
      delete project['_prometheus_cloud_flavor'];
    }
    consul.code = project.code.toLowerCase();
    consul.description = `Project ${project.name} dedicated Consul cluster`;
    consul.keypair_name = project.code.toLowerCase();
    consul.network_name = `${project.code.toLowerCase()}-mgmt`;
    consul.network_subnet_name = `${project.code.toLowerCase()}-mgmt-subnet`;
    consul.architecture_type = 'singletier';
    consul.server_image = 'Dinivas Base';
    consul.server_flavor = 'dinivas.medium';
    consul.client_image = 'Dinivas Base';
    consul.client_flavor = 'dinivas.medium';
    consul.use_floating_ip = false;
    delete project['_consul'];
  }

  submitPlanProject(project: ProjectDTO, consul: ConsulDTO) {
    this.prepareProjectFormValueBeforeSendToServer(project, consul);
    this.projectPlanInProgress = true;
    this.projectPlanStepFinished = false;
    if (!project['code'] && this.project) {
      // Set code because formbuilder has exclude it
      project.code = this.project.code;
    }
    project.logging_stack = this.loggingStack;
    if (!this.project) {
      this.planProject(project, consul);
    } else {
      project.id = this.project.id;
      this.planProject(project, consul);
    }
  }

  planProject(project: ProjectDTO, consul: ConsulDTO) {
    this.projectService.planProject({ project, consul }).subscribe(
      () => {
        const projectPlanEventSubscription = this.terraformWebSocket
          .receivePlanEvent(project.code)
          .subscribe((data: TerraformPlanEvent<ProjectDTO>) => {
            console.log('Receive TerraformPlanEvent from Terrform WS', data);
            projectPlanEventSubscription.unsubscribe();
            this.terraformPlanEvent = data;
            this.projectPlanInProgress = false;
            this.projectPlanStepFinished = true;
            setTimeout(() => {
              this.projectWizardStepper.next();
            }, 1);
          });
        this.terraformWebSocket
          .receivePlanErrorEvent(project.code)
          .subscribe((error: string) => {
            this.alertService.error(error);
            this.projectPlanInProgress = false;
            this.projectPlanStepFinished = false;
          });
      },
      error => {
        this.projectPlanInProgress = false;
        this.projectPlanStepFinished = false;
      }
    );
  }

  submitApplyProjectPlan(project: ProjectDTO, consul: ConsulDTO) {
    this.prepareProjectFormValueBeforeSendToServer(project, consul);
    this.projectApplyInProgress = true;
    if (!this.project) {
      // create
      this.projectService
        .createProject({ project, consul })
        .subscribe((projectDefinition: ProjectDefinitionDTO) => {
          this.applyProject(
            projectDefinition.project,
            projectDefinition.consul
          );
        });
    } else {
      // update
      project.id = this.project.id;
      consul.id = this.consul.id;
      consul.project = project;
      this.projectService
        .updateProject({ project, consul })
        .subscribe((projectDefinition: ProjectDefinitionDTO) => {
          this.applyProject(
            projectDefinition.project,
            projectDefinition.consul
          );
        });
    }
  }

  applyProject(project: ProjectDTO, consul: ConsulDTO) {
    this.projectService
      .applyProjectPlan(
        new ApplyModuleDTO<ProjectDefinitionDTO>(
          { project, consul: consul },
          this.terraformPlanEvent.workingDir
        )
      )
      .subscribe(
        () => {
          const projectApplyEventSubscription = this.terraformWebSocket
            .receiveApplyEvent(project.code)
            .subscribe((data: TerraformApplyEvent<ProjectDTO>) => {
              console.log('Receive TerraformApplyEvent from Terrform WS', data);
              projectApplyEventSubscription.unsubscribe();
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
          const receiveApplyErrorSubcription = this.terraformWebSocket
            .receiveApplyErrorEvent(project.code)
            .subscribe((error: string) => {
              receiveApplyErrorSubcription.unsubscribe();
              this.alertService.error(error);
              this.projectApplyInProgress = false;
              this.projectPlanStepFinished = false;
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
      '_prometheus_cloud_flavor'
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
      '_proxy_cloud_flavor'
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
          this.projectForm.get('availability_zone').reset();
          this.projectForm.get('floating_ip_pool').reset();
          this.projectForm.get('public_router').reset();
          this.projectForm.get('availability_zone').enable();
          this.projectForm.get('floating_ip_pool').enable();
          this.projectForm.get('public_router').enable();
          // Retrieve availability zones from cloud provider
          this.cloudproviderService
            .getCloudProviderAvailabilityZones(cloudprovider.id)
            .subscribe(availabilityZones => {
              this.availabilityZones = availabilityZones;
              if (this.project && this.project.availability_zone) {
                this.projectForm.controls['availability_zone'].patchValue(
                  this.project.availability_zone
                );
              } else if (this.availabilityZones.length === 1) {
                this.projectForm.controls['availability_zone'].patchValue(
                  this.availabilityZones[0].zoneName
                );
              }
              if (this.consul && this.consul.cluster_datacenter) {
                (this.projectForm.controls['_consul'] as FormGroup).controls[
                  'cluster_datacenter'
                ].patchValue(this.consul.cluster_datacenter);
              } else if (this.availabilityZones.length === 1) {
                (this.projectForm.controls['_consul'] as FormGroup).controls[
                  'cluster_datacenter'
                ].patchValue(this.availabilityZones[0].zoneName);
              }
            });

          // Retrieve floating ips from cloud provider
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
          // Retrieve routers from cloud provider
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
                // this.projectForm
                //   .get('_bastion_cloud_image')
                //   .patchValue(
                //     this.cloudImages.find(
                //       img =>
                //         img.tags.indexOf('base') > -1 &&
                //         img.tags.indexOf('dinivas') > -1
                //     ).name
                //   );
              });
          }

          if (this.project && this.project.prometheus_cloud_flavor) {
            this.projectForm
              .get('_prometheus_cloud_flavor')
              .patchValue(this.project.prometheus_cloud_flavor);
          }
          if (this.project && this.project.bastion_cloud_flavor) {
            this.projectForm
              .get('_bastion_cloud_flavor')
              .patchValue(this.project.bastion_cloud_flavor);
          }

          if (this.project && this.project.bastion_cloud_image) {
            this.projectForm
              .get('_bastion_cloud_image')
              .patchValue(this.project.bastion_cloud_image);
          }
        } else {
          this.projectForm.get('availability_zone').reset();
          this.projectForm.get('floating_ip_pool').reset();
          this.projectForm.get('public_router').reset();
          this.projectForm.get('floating_ip_pool').disable();
          this.projectForm.get('public_router').disable();
        }
      });
  }
}
