import { ConfirmDialogService } from './../../../core/dialog/confirm-dialog/confirm-dialog.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { TerraformModuleWizardVarsProvider } from './../../../shared/terraform/terraform-module-wizard/terraform-module-wizard.component';
import { map, filter, flatMap, toArray, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { GitlabService } from './../../../shared/gitlab/gitlab.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  AbstractControl,
} from '@angular/forms';
import {
  GitlabDTO,
  ICloudApiImage,
  ICloudApiFlavor,
  GitlabRunnerDTO,
  ProjectDTO,
  ApplyModuleDTO,
} from '@dinivas/api-interfaces';
import {
  Component,
  OnInit,
  EventEmitter,
  AfterViewChecked,
  ChangeDetectorRef,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { findIndex } from 'lodash';
import { TerraformModuleEntityInfo } from '../../../shared/terraform/terraform-module-entity-info';
import { MatVerticalStepper } from '@angular/material/stepper';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'dinivas-gitlab-wizard',
  templateUrl: './gitlab-wizard.component.html',
})
export class GitlabWizardComponent
  implements
    OnInit,
    AfterViewChecked,
    TerraformModuleWizardVarsProvider<GitlabDTO>
{
  gitlab: GitlabDTO;
  gitlabForm: FormGroup;
  moduleWizardStepper: Observable<MatVerticalStepper>;
  serverCloudImages: ICloudApiImage[];
  runnerCloudImages: ICloudApiImage[];
  cloudFlavors: ICloudApiFlavor[];
  terraformStateOutputs: any[];
  shouldShowSensitiveData: any = {};
  showingDirectOutput = false;
  runnerExecutors: ('shell' | 'docker' | 'docker+machine')[] = [
    'shell',
    'docker',
    'docker+machine',
  ];

  architectureType: string;
  planApplied: EventEmitter<any>;
  showOutputApplied: EventEmitter<any>;

  applyApplied: EventEmitter<any>;
  onArchitectureTypeChanged: EventEmitter<any>;
  project: ProjectDTO;
  projectTfState: any;
  projectNetwork: string;
  projectNetworkSubnet: string;
  projectKeypair: string;
  projectTfStateSubject = new Subject<any>();

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    private formBuilder: FormBuilder,
    private gitlabService: GitlabService,
    private confirmService: ConfirmDialogService,
    private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef
  ) {
    activatedRoute.data
      .pipe(map((data) => data.cloudFlavors))
      .subscribe(
        (cloudFlavors: ICloudApiFlavor[]) => (this.cloudFlavors = cloudFlavors)
      );
    activatedRoute.data
      .pipe(map((data) => data.cloudImages))
      .subscribe((cloudImages: ICloudApiImage[]) => {
        this.serverCloudImages = cloudImages.filter(
          (img) =>
            ('openstack' === img.cloudprovider &&
              img.tags.indexOf('gitlab') > -1) ||
            'digitalocean' === img.cloudprovider
        );
        this.runnerCloudImages = cloudImages.filter(
          (img) =>
            ('openstack' === img.cloudprovider &&
              img.tags.indexOf('gitlab') > -1) || // || img.tags.indexOf('docker') > -1
            'digitalocean' === img.cloudprovider
        );
      });
    activatedRoute.data
      .pipe(map((data) => data.currentProjectInfo))
      .subscribe((projectInfo: TerraformModuleEntityInfo<ProjectDTO>) => {
        this.project = projectInfo.entity;
        this.projectTfState = projectInfo.entityState;
        this.projectNetwork = this.toCloudProviderNetworkIdentifier(
          this.project.cloud_provider.cloud,
          this.projectTfState.outputs
        );
        this.projectNetworkSubnet = this.toCloudProviderSubnetNetworkIdentifier(
          this.project.cloud_provider.cloud,
          this.projectTfState.outputs
        );
        this.projectKeypair =
          this.projectTfState.outputs['project_keypair_name'].value;
        this.projectTfStateSubject.next(undefined);
      });
  }

  toCloudProviderNetworkIdentifier(
    cloudprovider: string,
    stateOutput: any
  ): string {
    switch (cloudprovider) {
      case 'openstack':
        return stateOutput['mgmt_network_name']
          ? stateOutput['mgmt_network_name'].value[0]
          : this.gitlab.network_subnet_name;
      case 'digitalocean':
        return stateOutput['mgmt_network_name']
          ? stateOutput['mgmt_network_name'].value
          : this.gitlab.network_subnet_name;
      default:
        return undefined;
    }
  }
  toCloudProviderSubnetNetworkIdentifier(
    cloudprovider: string,
    stateOutput: any
  ): string {
    switch (cloudprovider) {
      case 'openstack':
        return stateOutput['mgmt_subnet_names']
          ? stateOutput['mgmt_subnet_names'].value[0]
          : this.gitlab.network_subnet_name;
      case 'digitalocean':
        return stateOutput['mgmt_network_name']
          ? stateOutput['mgmt_network_name'].value
          : this.gitlab.network_subnet_name;
      default:
        return undefined;
    }
  }

  ngOnInit() {
    this.activatedRoute.data
      .pipe(map((data) => data.moduleEntity))
      .subscribe((moduleEntity: TerraformModuleEntityInfo<GitlabDTO>) => {
        this.gitlab = moduleEntity ? moduleEntity.entity : undefined;
        // Wait for project state to be resolved before init form
        //this.projectTfStateSubject.subscribe(()=>this.initGitlabForm());
        this.initGitlabForm();
      });

    this.onArchitectureTypeChanged.subscribe(
      (architectureType: string) => (this.architectureType = architectureType)
    );
    this.moduleWizardStepper.subscribe((stepper) => {
      if (this.gitlab && this.gitlab.architecture_type) {
        //setTimeout(() => (stepper.selectedIndex = 1), 1);
      }
    });
  }

  ngAfterViewChecked(): void {
    // workaround because of Expression has changed after it was checked. Previous value: 'ngIf: true' form valid
    this.cdRef.detectChanges();
  }

  initGitlabForm() {
    this.gitlabForm = this.formBuilder.group({
      code: [this.gitlab ? this.gitlab.code : null, Validators.required],
      admin_username: [
        this.gitlab ? this.gitlab.admin_username : 'admin',
        Validators.required,
      ],
      admin_password: [
        this.gitlab ? this.gitlab.admin_password : 'admin',
        Validators.required,
      ],
      description: [this.gitlab ? this.gitlab.description : null, null],
      use_existing_instance: [
        this.gitlab ? this.gitlab.use_existing_instance : true,
        null,
      ],
      network_name: [
        this.gitlab ? this.gitlab.network_name : this.projectNetwork,
        Validators.required,
      ],
      network_subnet_name: [
        this.gitlab
          ? this.gitlab.network_subnet_name
          : this.projectNetworkSubnet,
        Validators.required,
      ],
      keypair_name: [
        this.gitlab ? this.gitlab.keypair_name : this.projectKeypair,
        Validators.required,
      ],
      _cloud_image: [
        this.gitlab ? this.gitlab.cloud_image : null,
        Validators.nullValidator,
      ],
      _cloud_flavor: [
        this.gitlab ? this.gitlab.cloud_flavor : null,
        Validators.nullValidator,
      ],
      use_floating_ip: [
        this.gitlab ? this.gitlab.use_floating_ip : false,
        null,
      ],
      link_to_keycloak: [
        this.gitlab ? this.gitlab.link_to_keycloak : true,
        null,
      ],
      keycloak_client_id: [
        this.gitlab ? this.gitlab.keycloak_client_id : 'gitlab',
        null,
      ],
      existing_instance_url: [
        this.gitlab ? this.gitlab.existing_instance_url : 'https://gitlab.com/',
        Validators.nullValidator,
      ],
      manage_runner: [this.gitlab ? this.gitlab.manage_runner : false, null],
      runners: this.formBuilder.array(
        this.gitlab && this.gitlab.runners && this.gitlab.runners.length > 0
          ? this.gitlab.runners.map((sG) =>
              this.createSlaveFormGroup(
                sG,
                this.gitlab ? this.gitlab.manage_runner : false
              )
            )
          : [
              this.createSlaveFormGroup(
                new GitlabRunnerDTO(),
                this.gitlab ? this.gitlab.manage_runner : false
              ),
            ]
      ),
    });
    if (this.gitlab && this.gitlab.code) {
      this.gitlabForm.get('code').disable();
    }
    if (!this.gitlab) {
      if (this.gitlabForm.get('use_existing_instance').value) {
        this.gitlabForm.get('manage_runner').enable();
      } else {
        this.gitlabForm.get('manage_runner').disable();
      }
    }
    this.gitlabForm.get('network_name').disable();
    this.gitlabForm.get('network_subnet_name').disable();
    this.gitlabForm.get('keypair_name').disable();
    this.setExistingMasterValidators();
    this.setManageSlaveValidators();
    this.gitlabForm
      .get('runners')
      .valueChanges.subscribe((slaveGroup: GitlabRunnerDTO[]) => {
        if (slaveGroup && slaveGroup.length === 0) {
          this.gitlabForm.get('manage_runner').patchValue(false);
          if (!this.gitlabForm.dirty) {
            this.gitlabForm.markAsDirty();
          }
        }
      });
    this.gitlabForm
      .get('manage_runner')
      .valueChanges.subscribe((manageSlaveGroups: boolean) => {
        if (
          manageSlaveGroups &&
          this.gitlabForm.get('runners').value.length === 0
        ) {
          this.addGitlabSlave(null);
        }
      });
  }

  createSlaveFormGroup(
    gitlabRunnerGroup: GitlabRunnerDTO,
    manageSlave: boolean
  ) {
    const formGroup = this.formBuilder.group({
      id: [gitlabRunnerGroup.id ? gitlabRunnerGroup.id : null],
      code: [
        gitlabRunnerGroup.code ? gitlabRunnerGroup.code : '',
        Validators.required,
      ],
      runner_name: [
        gitlabRunnerGroup.runner_name ? gitlabRunnerGroup.runner_name : '',
        Validators.required,
      ],
      description: [
        gitlabRunnerGroup.description ? gitlabRunnerGroup.description : '',
      ],
      gitlab_token: [
        gitlabRunnerGroup.gitlab_token ? gitlabRunnerGroup.gitlab_token : '',
        Validators.required,
      ],
      executor: [
        gitlabRunnerGroup.executor ? gitlabRunnerGroup.executor : 'docker',
        Validators.required,
      ],
      tags: [gitlabRunnerGroup.tags ? gitlabRunnerGroup.tags : []],
      instance_count: [
        gitlabRunnerGroup.instance_count ? gitlabRunnerGroup.instance_count : 1,
      ],
      runner_cloud_image: [
        gitlabRunnerGroup ? gitlabRunnerGroup.runner_cloud_image : null,
        Validators.nullValidator,
      ],
      runner_cloud_flavor: [
        gitlabRunnerGroup.runner_cloud_flavor
          ? gitlabRunnerGroup.runner_cloud_flavor
          : null,
        Validators.nullValidator,
      ],
    });

    this.handleSlaveValidators(formGroup, manageSlave);

    return formGroup;
  }

  setExistingMasterValidators() {
    const cloudImage: AbstractControl = this.gitlabForm.get('_cloud_image');
    const cloudFlavor: AbstractControl = this.gitlabForm.get('_cloud_flavor');
    const keycloaClientId: AbstractControl =
      this.gitlabForm.get('keycloak_client_id');
    this.gitlabForm
      .get('use_existing_instance')
      .valueChanges.subscribe((useExistingMaster: boolean) => {
        if (useExistingMaster) {
          this.resetFormControlValidatorsAndErrors(cloudImage, cloudFlavor);
        } else {
          cloudImage.setValidators([Validators.required]);
          cloudFlavor.setValidators([Validators.required]);
        }
      });

    this.gitlabForm
      .get('link_to_keycloak')
      .valueChanges.subscribe((linkToKeycloak: boolean) => {
        if (linkToKeycloak) {
          keycloaClientId.setValidators([Validators.required]);
        } else {
          this.resetFormControlValidatorsAndErrors(keycloaClientId);
        }
      });
  }

  resetFormControlValidatorsAndErrors(...formControls: AbstractControl[]) {
    formControls.forEach((fC) => {
      if (fC.errors && fC.errors['required']) fC.setErrors(null);
      fC.setValidators([Validators.nullValidator]);
    });
  }

  handleSlaveValidators = (formGroup: FormGroup, manageSlave: boolean) => {
    if (manageSlave) {
      formGroup.get('code').setValidators([Validators.required]);
      formGroup.get('runner_name').setValidators([Validators.required]);
      formGroup.get('gitlab_token').setValidators([Validators.required]);
      formGroup.get('instance_count').setValidators([Validators.required]);
      formGroup.get('runner_cloud_image').setValidators([Validators.required]);
      formGroup.get('runner_cloud_flavor').setValidators([Validators.required]);
    } else {
      formGroup.get('code').setValidators([Validators.nullValidator]);
      formGroup.get('runner_name').setValidators([Validators.nullValidator]);
      formGroup.get('gitlab_token').setValidators([Validators.nullValidator]);
      formGroup.get('instance_count').setValidators([Validators.nullValidator]);
      formGroup
        .get('runner_cloud_image')
        .setValidators([Validators.nullValidator]);
      formGroup
        .get('runner_cloud_flavor')
        .setValidators([Validators.nullValidator]);
    }
  };

  setManageSlaveValidators() {
    const slaveGroups: FormArray = this.gitlabForm.get('runners') as FormArray;
    this.gitlabForm
      .get('manage_runner')
      .valueChanges.subscribe((manageSlave: boolean) => {
        slaveGroups.controls.forEach((formGroup) => {
          this.handleSlaveValidators(formGroup as FormGroup, manageSlave);
        });
      });
  }
  removeRunner(index: number) {
    this.confirmService.doOnConfirm(
      `Do you want to delete Runner with index ${index}?`,
      () => {
        const slaveGroups = this.gitlabForm.get('runners') as FormArray;
        slaveGroups.removeAt(index);
      }
    );
  }

  addGitlabSlave(gitlabRunnerGroup: GitlabRunnerDTO) {
    const slaveGroups = this.gitlabForm.get('runners') as FormArray;
    setTimeout(() => {
      slaveGroups.push(
        this.createSlaveFormGroup(
          gitlabRunnerGroup ? gitlabRunnerGroup : new GitlabRunnerDTO(),
          this.gitlabForm.get('manage_runner').value
        )
      );
    }, 1);
  }

  addRunnerGroupTag(
    gitlabRunnerGroup: GitlabRunnerDTO,
    event: MatChipInputEvent
  ) {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      gitlabRunnerGroup.tags.push(value.trim());
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
  removeRunnerGroupTag(gitlabRunnerGroup: GitlabRunnerDTO, tag: string) {
    gitlabRunnerGroup.tags.splice(
      findIndex(gitlabRunnerGroup.tags, (l) => l === tag),
      1
    );
  }

  isFormValid(): boolean {
    const formValid = this.gitlabForm && this.gitlabForm.valid;
    return formValid;
  }

  moduleServicePlan(
    moduleEntity: GitlabDTO
  ): Observable<{ planJobId: number }> {
    return this.gitlabService.plan(moduleEntity);
  }

  prepareGitlabDTOBeforeSendToServer(gitlab: GitlabDTO) {
    // Set master image name
    if (gitlab && this.gitlabForm.get('_cloud_image').value) {
      gitlab.cloud_image = this.toCloudProviderImageId(
        this.gitlabForm.get('_cloud_image').value as ICloudApiImage
      );
      delete gitlab['_cloud_image'];
    }
    // Set master flavor name
    if (gitlab && this.gitlabForm.get('_cloud_flavor').value) {
      gitlab.cloud_flavor = (
        this.gitlabForm.get('_cloud_flavor').value as ICloudApiFlavor
      ).name;
      delete gitlab['_cloud_flavor'];
    }
    // add project code preffix to gitlab code and all runner code
    if (!this.gitlab) {
      // add prefix only for new Gitlab
      gitlab.code = `${this.project.code.toLowerCase()}-${gitlab.code.toLowerCase()}`;
    }
    if (gitlab.manage_runner) {
      gitlab.runners.forEach((runner, runnerIndex) => {
        if (!runner.id) {
          // add prefix only for new Gitlab
          runner.code = `${gitlab.code}-${runner.code.toLowerCase()}`;
        }
        runner.gitlab_url = gitlab.use_existing_instance
          ? gitlab.existing_instance_url
          : gitlab.existing_instance_url;
        runner.runner_cloud_image = this.toCloudProviderImageId(
          this.gitlabForm.get('runners').value[runnerIndex].runner_cloud_image
        );
        runner.runner_cloud_flavor =
          this.gitlabForm.get('runners').value[
            runnerIndex
          ].runner_cloud_flavor.name;
        runner.runner_install_client = true;
      });
    } else {
      gitlab.runners = [];
    }
    if (this.gitlab) {
      gitlab.id = this.gitlab.id;
    }
    gitlab.architecture_type = this.architectureType;
  }

  submitApplyPlan(gitlab: GitlabDTO) {
    this.applyApplied.emit(gitlab);
  }

  submitPlanGitlab(gitlab: GitlabDTO) {
    this.prepareGitlabDTOBeforeSendToServer(gitlab);
    this.planApplied.emit(gitlab);
  }
  showGitlabOutput(gitlab: GitlabDTO) {
    this.showOutputApplied.emit(gitlab);
  }

  moduleServiceApplyPlan(
    moduleEntity: GitlabDTO
  ): Observable<{ applyJobId: number }> {
    if (this.gitlab) {
      moduleEntity.id = this.gitlab.id;
    }

    return this.gitlabService.applyPlan(new ApplyModuleDTO(moduleEntity));
  }

  terraformWebsocketEventId(moduleEntity: GitlabDTO): string {
    return moduleEntity.code;
  }

  moduleServiceTerraformState(moduleEntity: GitlabDTO): Observable<any> {
    return this.gitlabService.getTerraformState(moduleEntity.id);
  }

  toCloudProviderImageId(image: ICloudApiImage) {
    const cloudProvider = this.project.cloud_provider;
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
