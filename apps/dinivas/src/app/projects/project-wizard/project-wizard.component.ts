import { TerraformModuleEntityInfo } from './../../shared/terraform/terraform-module-entity-info';
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
  AbstractControl,
} from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ProjectDTO,
  CloudproviderDTO,
  ICloudApiProjectFloatingIpPool,
  ICloudApiProjectRouter,
  TerraformModuleEvent,
  ICloudApiImage,
  ICloudApiFlavor,
  ApplyModuleDTO,
  ICloudApiAvailabilityZone,
  ConsulDTO,
  ProjectDefinitionDTO,
  ICloudApiProjectFloatingIp,
} from '@dinivas/api-interfaces';
import { MatVerticalStepper } from '@angular/material/stepper';
import { filter, flatMap, toArray, map } from 'rxjs/operators';
import { SharedWebSocket } from '../../shared/shared-websocket.service';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

@Component({
  selector: 'dinivas-project-wizard',
  templateUrl: './project-wizard.component.html',
  styleUrls: ['./project-wizard.component.scss'],
})
export class ProjectWizardComponent implements OnInit {
  project: ProjectDTO;
  consul: ConsulDTO;
  projectForm: FormGroup;
  projectPlanFormGroup: FormGroup;
  cloudproviders: CloudproviderDTO[];
  availableFloatingIpPools: ICloudApiProjectFloatingIpPool[];
  availableFloatingIps: ICloudApiProjectFloatingIp[];
  availableRouters: ICloudApiProjectRouter[];
  loggingStack = 'graylog';
  isLinear = true;
  projectPlanStepFinished = false;
  projectApplyStepFinished = false;
  projectPlanInProgress = false;
  projectApplyInProgress = false;
  @ViewChild(MatVerticalStepper)
  projectWizardStepper: MatVerticalStepper;
  terraformPlanEvent: TerraformModuleEvent<ProjectDTO>;
  terraformApplyEvent: TerraformModuleEvent<ProjectDTO>;
  terraformStateOutputs: any[];
  shouldShowSensitiveData: any = {};
  showingDirectOutput = false;
  cloudImages: ICloudApiImage[];
  proxyCloudImages: ICloudApiImage[];
  cloudFlavors: ICloudApiFlavor[];
  availabilityZones: ICloudApiAvailabilityZone[];

  planSpinnerMode: ProgressSpinnerMode = 'determinate';
  applySpinnerMode: ProgressSpinnerMode = 'determinate';
  planSpinnerValue = 0;
  applySpinnerValue = 0;

  constructor(
    private formBuilder: FormBuilder,
    private projectService: ProjectsService,
    private consulService: ConsulService,
    private readonly cloudproviderService: CloudproviderService,
    private readonly terraformWebSocket: SharedWebSocket,
    private activatedRoute: ActivatedRoute,
    private contextualMenuService: ContextualMenuService,
    private alertService: AlertService
  ) {
    activatedRoute.data
      .pipe(map((data) => data.cloudFlavors))
      .subscribe(
        (cloudFlavors: ICloudApiFlavor[]) => (this.cloudFlavors = cloudFlavors)
      );
    activatedRoute.data
      .pipe(map((data) => data.cloudImages))
      .subscribe((cloudImages: ICloudApiImage[]) => {
        this.cloudImages = cloudImages;
        if (cloudImages) {
          this.proxyCloudImages = cloudImages.filter(
            (img) => img.tags.indexOf('proxy') > -1
          );
        }
      });
    activatedRoute.data
      .pipe(map((data) => data.availabilityZones))
      .subscribe(
        (availabilityZones: ICloudApiAvailabilityZone[]) =>
          (this.availabilityZones = availabilityZones)
      );
  }

  ngOnInit() {
    this.activatedRoute.data
      .pipe(map((data) => data.currentProjectInfo))
      .subscribe(async (projectInfo: TerraformModuleEntityInfo<ProjectDTO>) => {
        this.project = projectInfo ? projectInfo.entity : undefined;
        if (this.project) {
          this.consul = await this.consulService
            .getOneByCode(this.project.code)
            .toPromise();
        }
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
        Validators.required,
      ],
      root_domain: [this.project ? this.project.root_domain : null, null],
      description: [this.project ? this.project.description : null, null],
      availability_zone: [
        this.project ? this.project.availability_zone : null,
        Validators.required,
      ],
      public_router: [this.project ? this.project.public_router : null, null],
      management_subnet_cidr: [
        this.project ? this.project.management_subnet_cidr : '10.10.15.0/24',
        null,
      ],
      management_subnet_dhcp_allocation_start: [
        this.project
          ? this.project.management_subnet_dhcp_allocation_start
          : '10.10.15.2',
      ],
      management_subnet_dhcp_allocation_end: [
        this.project
          ? this.project.management_subnet_dhcp_allocation_end
          : '10.10.15.254',
      ],
      floating_ip_pool: [
        this.project ? this.project.floating_ip_pool : null,
        null,
      ],
      monitoring: [this.project ? this.project.monitoring : false, null],
      logging: [this.project ? this.project.logging : false, null],
      _bastion_cloud_image: [
        this.project ? this.project.bastion_cloud_image : null,
        Validators.required,
      ],
      _bastion_cloud_flavor: [
        this.project ? this.project.bastion_cloud_flavor : null,
        Validators.required,
      ],
      enable_proxy: [this.project ? this.project.enable_proxy : true, null],
      proxy_prefered_floating_ip: [
        this.project ? this.project.proxy_prefered_floating_ip : '',
        null,
      ],
      _proxy_cloud_image: [
        this.project ? this.project.proxy_cloud_image : null,
        null,
      ],
      _proxy_cloud_flavor: [
        this.project ? this.project.proxy_cloud_flavor : null,
        null,
      ],
      keycloak_host: [
        this.project ? this.project.keycloak_host : null,
        Validators.required,
      ],
      keycloak_client_id: [
        this.project ? this.project.keycloak_client_id : 'dinivas-terraform',
        Validators.required,
      ],
      keycloak_client_secret: [
        this.project ? this.project.keycloak_client_secret : null,
        Validators.required,
      ],
      _prometheus_cloud_flavor: [
        this.project ? this.project.prometheus_cloud_flavor : null,
      ],
      // _graylog_cloud_flavor: [
      //   this.project ? this.project.graylog_compute_flavour_name : null
      // ],
      _consul: this.formBuilder.group({
        cluster_domain: [
          this.consul ? this.consul.cluster_domain : 'consul',
          Validators.required,
        ],
        cluster_datacenter: [
          this.consul ? this.consul.cluster_datacenter : null,
          Validators.required,
        ],
        server_instance_count: [
          this.consul ? this.consul.server_instance_count : 1,
          Validators.required,
        ],
        _consul_server_cloud_image: [
          this.project ? this.consul.server_image : null,
          Validators.required,
        ],
        _consul_server_cloud_flavor: [
          this.project ? this.consul.server_flavor : null,
          Validators.required,
        ],
        client_instance_count: [
          this.consul ? this.consul.client_instance_count : 0,
          Validators.required,
        ],
        _consul_client_cloud_image: [
          this.project ? this.consul.client_image : null,
        ],
        _consul_client_cloud_flavor: [
          this.project ? this.consul.client_flavor : null,
        ],
      }),
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
      this.projectForm.get('proxy_prefered_floating_ip').disable();
      this.projectForm.get('public_router').disable();
    }
    this.setMonitoringValidators();
    //this.setLoggingValidators();
    this.setProxyValidators();
    this.setConsulValidators();
    this.setRoutingValidators();
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
      project.bastion_cloud_image = this.toCloudProviderImageId(
        this.projectForm.get('_bastion_cloud_image').value as ICloudApiImage
      );
      delete project['_bastion_cloud_image'];
    }
    // Set bastion image name
    if (project && this.projectForm.get('_bastion_cloud_flavor').value) {
      project.bastion_cloud_flavor = (
        this.projectForm.get('_bastion_cloud_flavor').value as ICloudApiFlavor
      ).name;
      delete project['_bastion_cloud_flavor'];
    }

    // Set proxy image name
    if (project && this.projectForm.get('_proxy_cloud_image').value) {
      project.proxy_cloud_image = this.toCloudProviderImageId(
        this.projectForm.get('_proxy_cloud_image').value as ICloudApiImage
      );
      delete project['_proxy_cloud_image'];
    }

    // Set proxy flavor name
    if (project && this.projectForm.get('_proxy_cloud_flavor').value) {
      project.proxy_cloud_flavor = (
        this.projectForm.get('_proxy_cloud_flavor').value as ICloudApiFlavor
      ).name;
      delete project['_proxy_cloud_flavor'];
    }

    project.logging_stack = this.loggingStack || 'graylog';

    // Set prometheus flavor name
    if (project && this.projectForm.get('_prometheus_cloud_flavor').value) {
      project.bastion_cloud_flavor = (
        this.projectForm.get('_prometheus_cloud_flavor')
          .value as ICloudApiFlavor
      ).name;
      delete project['_prometheus_cloud_flavor'];
    }
    consul.code = project.code.toLowerCase();
    consul.description = `Project ${project.name} dedicated Consul cluster`;
    consul.keypair_name = project.code.toLowerCase();
    consul.network_name = `${project.code.toLowerCase()}-mgmt`;
    consul.network_subnet_name = `${project.code.toLowerCase()}-mgmt-subnet`;
    consul.architecture_type = 'singletier';
    consul.server_image = this.toCloudProviderImageId(
      this.projectForm.get('_consul').get('_consul_server_cloud_image')
        .value as ICloudApiImage
    );
    consul.server_flavor = (
      this.projectForm.get('_consul').get('_consul_server_cloud_flavor')
        .value as ICloudApiFlavor
    ).name;
    consul.client_image = this.toCloudProviderImageId(
      this.projectForm.get('_consul').get('_consul_client_cloud_image')
        .value as ICloudApiImage
    );
    const consulClientFlavor = this.projectForm
      .get('_consul')
      .get('_consul_client_cloud_flavor').value as ICloudApiFlavor;
    if (consulClientFlavor) {
      consul.client_flavor = consulClientFlavor.name;
    }
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
    if (!this.project) {
      this.planProject(project, consul);
    } else {
      project.id = this.project.id;
      this.planProject(project, consul);
    }
  }

  planProject(project: ProjectDTO, consul: ConsulDTO) {
    this.planSpinnerMode = 'indeterminate';
    this.planSpinnerValue = 0;
    this.projectService.planProject({ project, consul }).subscribe(
      (res) => {
        const planJobProgressEventSuSubscription = this.terraformWebSocket
          .receiveBackgroundJobProgressEventForGivenJobId(res.planJobId)
          .subscribe((res) => {
            this.planSpinnerValue = res.progress;
          });
        const projectPlanEventSubscription = this.terraformWebSocket
          .receivePlanEvent<TerraformModuleEvent<ProjectDTO>>(project.code)
          .subscribe((data) => {
            console.log('Receive TerraformPlanEvent from Terrform WS', data);
            projectPlanEventSubscription.unsubscribe();
            this.terraformPlanEvent = data;
            this.projectPlanInProgress = false;
            this.projectPlanStepFinished = true;
            planJobProgressEventSuSubscription.unsubscribe();
            setTimeout(() => {
              this.projectWizardStepper.next();
            }, 1);
          });
        this.terraformWebSocket
          .receivePlanErrorEvent<string>(project.code)
          .subscribe((error: string) => {
            this.alertService.error(error);
            this.projectPlanInProgress = false;
            this.projectPlanStepFinished = false;
            planJobProgressEventSuSubscription.unsubscribe();
          });
          const planJobErrorEventSuSubscription = this.terraformWebSocket
          .receiveBackgroundJobFailedEventForGivenJobId(res.planJobId)
          .subscribe((err) => {
            planJobErrorEventSuSubscription.unsubscribe();
            this.alertService.error(err.error);
            this.projectPlanInProgress = false;
            this.projectPlanStepFinished = false;
            planJobProgressEventSuSubscription.unsubscribe();
          });
      },
      (error) => {
        this.projectPlanInProgress = false;
        this.projectPlanStepFinished = false;
      }
    );
  }

  submitApplyProjectPlan(project: ProjectDTO, consul: ConsulDTO) {
    this.prepareProjectFormValueBeforeSendToServer(project, consul);
    this.projectApplyInProgress = true;
    this.applyProject(project, consul);
  }

  applyProject(project: ProjectDTO, consul: ConsulDTO) {
    this.applySpinnerMode = 'indeterminate';
    this.applySpinnerValue = 0;
    this.projectService
      .applyProjectPlan(
        new ApplyModuleDTO<ProjectDefinitionDTO>({ project, consul: consul })
      )
      .subscribe(
        (res) => {
          const applyJobProgressEventSuSubscription = this.terraformWebSocket
            .receiveBackgroundJobProgressEventForGivenJobId(res.applyJobId)
            .subscribe((res) => {
              this.applySpinnerValue = res.progress;
            });
          const projectApplyEventSubscription = this.terraformWebSocket
            .receiveApplyEvent<TerraformModuleEvent<ProjectDTO>>(project.code)
            .subscribe((data) => {
              console.log('Receive TerraformApplyEvent from Terrform WS', data);
              projectApplyEventSubscription.unsubscribe();
              this.terraformApplyEvent = data;
              this.terraformStateOutputs =
                this.terraformApplyEvent.stateResult.values.outputs;
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
              applyJobProgressEventSuSubscription.unsubscribe();
              setTimeout(() => {
                this.projectWizardStepper.next();
              }, 1);
            });
          const receiveApplyErrorSubcription = this.terraformWebSocket
            .receiveApplyErrorEvent(project.code)
            .subscribe((error: any) => {
              receiveApplyErrorSubcription.unsubscribe();
              this.alertService.error(error);
              this.projectApplyInProgress = false;
              this.projectPlanStepFinished = false;
              applyJobProgressEventSuSubscription.unsubscribe();
            });

            const applyJobErrorEventSuSubscription = this.terraformWebSocket
            .receiveBackgroundJobFailedEventForGivenJobId(res.applyJobId)
            .subscribe((err) => {
              applyJobErrorEventSuSubscription.unsubscribe();
              this.alertService.error(err.error);
              this.projectApplyInProgress = false;
              this.projectPlanStepFinished = false;
              applyJobProgressEventSuSubscription.unsubscribe();
            });
        },
        (error) => {
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
      .subscribe((state) => (this.terraformStateOutputs = state.outputs));
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
  setLoggingValidators() {
    const graylogFlavor: AbstractControl = this.projectForm.get(
      '_graylog_cloud_flavor'
    );
    this.projectForm
      .get('logging')
      .valueChanges.subscribe((isLoggingEnabled: boolean) => {
        if (isLoggingEnabled) {
          graylogFlavor.setValidators([Validators.required]);
        } else {
          graylogFlavor.setValidators(null);
        }
        graylogFlavor.updateValueAndValidity();
      });
  }

  setRoutingValidators() {
    const publicRouterControl: AbstractControl =
      this.projectForm.get('public_router');
    const floatingIpPoolControl: AbstractControl =
      this.projectForm.get('floating_ip_pool');
    this.projectForm
      .get('cloud_provider')
      .valueChanges.subscribe((cloudprovider: CloudproviderDTO) => {
        if (cloudprovider != undefined && 'openstack' === cloudprovider.cloud) {
          publicRouterControl.setValidators([Validators.required]);
          floatingIpPoolControl.setValidators([Validators.required]);
        } else {
          publicRouterControl.setValidators(null);
          floatingIpPoolControl.setValidators(null);
        }
        publicRouterControl.updateValueAndValidity();
        floatingIpPoolControl.updateValueAndValidity();
      });
  }

  setProxyValidators() {
    const proxyImage: AbstractControl =
      this.projectForm.get('_proxy_cloud_image');
    const proxyFlavor: AbstractControl = this.projectForm.get(
      '_proxy_cloud_flavor'
    );
    this.projectForm
      .get('enable_proxy')
      .valueChanges.subscribe((isMonitoringEnabled: boolean) => {
        if (isMonitoringEnabled) {
          proxyImage.setValidators([Validators.required]);
          proxyFlavor.setValidators([Validators.required]);
        } else {
          proxyImage.setValidators(null);
          proxyFlavor.setValidators(null);
        }
        proxyImage.updateValueAndValidity();
        proxyFlavor.updateValueAndValidity();
      });
  }
  setConsulValidators() {
    const consulFormGroup: AbstractControl = this.projectForm.get('_consul');
    const consulClientImage: AbstractControl = consulFormGroup.get(
      '_consul_client_cloud_image'
    );
    const consulClientFlavor: AbstractControl = consulFormGroup.get(
      '_consul_client_cloud_flavor'
    );
    consulFormGroup
      .get('client_instance_count')
      .valueChanges.subscribe((consulClientInstanceCount: number) => {
        if (consulClientInstanceCount > 0) {
          consulClientImage.setValidators([Validators.required]);
          consulClientFlavor.setValidators([Validators.required]);
        } else {
          consulClientImage.setValidators(null);
          consulClientFlavor.setValidators(null);
        }
        consulClientImage.updateValueAndValidity();
        consulClientFlavor.updateValueAndValidity();
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
          this.projectForm.get('proxy_prefered_floating_ip').reset();
          this.projectForm.get('public_router').reset();
          this.projectForm.get('availability_zone').enable();
          this.projectForm.get('floating_ip_pool').enable();
          this.projectForm.get('proxy_prefered_floating_ip').enable();
          this.projectForm.get('public_router').enable();
          // Retrieve availability zones from cloud provider
          this.cloudproviderService
            .getCloudProviderAvailabilityZones(cloudprovider.id)
            .subscribe((availabilityZones) => {
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

          // Retrieve floating ip pools from cloud provider
          this.cloudproviderService
            .getCloudProviderFloatingIpPools(cloudprovider.id)
            .subscribe((floatingIpPools) => {
              this.availableFloatingIpPools = floatingIpPools;
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

          // Retrieve available floating ips from cloud provider
          this.cloudproviderService
            .getCloudProviderFloatingIps(cloudprovider.id)
            .subscribe((floatingIps) => {
              this.availableFloatingIps = floatingIps.filter(
                (floatingIp) =>
                  !floatingIp.fixed_ip ||
                  (this.project &&
                    floatingIp.fixed_ip &&
                    floatingIp.ip == this.project.proxy_prefered_floating_ip)
              );
              if (this.project && this.project.proxy_prefered_floating_ip) {
                this.projectForm.controls[
                  'proxy_prefered_floating_ip'
                ].patchValue(this.project.proxy_prefered_floating_ip);
              } else if (this.availableFloatingIps.length === 1) {
                this.projectForm.controls[
                  'proxy_prefered_floating_ip'
                ].patchValue(this.availableFloatingIps[0].ip);
                if (!this.projectForm.controls['root_domain'].value) {
                  this.projectForm.controls['root_domain'].patchValue(
                    `${this.availableFloatingIps[0].ip}.nip.io`
                  );
                }
              }
            });
          this.projectForm
            .get('proxy_prefered_floating_ip')
            .valueChanges.subscribe((preferedFloatingIp: string) => {
              if (!this.projectForm.controls['root_domain'].value) {
                this.projectForm.controls['root_domain'].patchValue(
                  `${preferedFloatingIp}.nip.io`
                );
              }
            });
          // Retrieve routers from cloud provider
          this.cloudproviderService
            .getCloudProviderRouters(cloudprovider.id)
            .subscribe((routers) => {
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
                flatMap((t) => t),
                filter(
                  (flavor) =>
                    ('openstack' === flavor.cloudprovider &&
                      flavor.name.indexOf('dinivas') > -1) ||
                    'digitalocean' === flavor.cloudprovider
                ),
                toArray(),
                map((items) =>
                  items.sort((a, b) => {
                    return a.vcpus - b.vcpus;
                  })
                )
              )
              .subscribe((cloudFlavors) => {
                this.cloudFlavors = cloudFlavors;
              });
          }

          if (!this.project) {
            this.cloudproviderService
              .getCloudProviderImages(cloudprovider.id)
              .pipe(
                flatMap((t) => t),
                filter(
                  (img) =>
                    ('openstack' === img.cloudprovider &&
                      img.tags.indexOf('dinivas') > -1) ||
                    'digitalocean' === img.cloudprovider
                ),
                toArray()
              )
              .subscribe((cloudImages) => {
                this.cloudImages = cloudImages;
                if (cloudImages) {
                  this.proxyCloudImages = cloudImages.filter(
                    (img) =>
                      ('openstack' === img.cloudprovider &&
                        img.tags.indexOf('dinivas') > -1) ||
                      'digitalocean' === img.cloudprovider
                  );
                }
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
          this.projectForm.get('proxy_prefered_floating_ip').reset();
          this.projectForm.get('public_router').reset();
          this.projectForm.get('floating_ip_pool').disable();
          this.projectForm.get('proxy_prefered_floating_ip').disable();
          this.projectForm.get('public_router').disable();
        }
      });
  }

  // TrackBy
  trackById(index: number, element: any): any {
    return element.id;
  }

  toCloudProviderImageId(image: ICloudApiImage) {
    const cloudProvider = this.projectForm.controls['cloud_provider']
      .value as CloudproviderDTO;
    if (!image) return null;
    switch (cloudProvider.cloud) {
      case 'openstack':
        return image.name;
      case 'digitalocean':
        return image.id;
      default:
        return image.name;
    }
  }
}
