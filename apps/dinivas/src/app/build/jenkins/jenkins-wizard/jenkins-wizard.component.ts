import { ConfirmDialogService } from './../../../core/dialog/confirm-dialog/confirm-dialog.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { TerraformModuleWizardVarsProvider } from './../../../shared/terraform/terraform-module-wizard/terraform-module-wizard.component';
import { map, filter, flatMap, toArray, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { JenkinsService } from './../../../shared/jenkins/jenkins.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  AbstractControl,
} from '@angular/forms';
import {
  JenkinsDTO,
  ICloudApiImage,
  ICloudApiFlavor,
  TerraformPlanEvent,
  TerraformApplyEvent,
  JenkinsSlaveGroupDTO,
  ProjectDTO,
  ApplyModuleDTO,
} from '@dinivas/api-interfaces';
import {
  Component,
  OnInit,
  ViewChild,
  EventEmitter,
  Input,
  AfterViewChecked,
  ChangeDetectorRef,
} from '@angular/core';
import { Observable, Subject, forkJoin } from 'rxjs';
import { findIndex } from 'lodash';
import { TerraformModuleEntityInfo } from '../../../shared/terraform/terraform-module-entity-info';
import { MatVerticalStepper } from '@angular/material/stepper';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'dinivas-jenkins-wizard',
  templateUrl: './jenkins-wizard.component.html',
})
export class JenkinsWizardComponent
  implements
    OnInit,
    AfterViewChecked,
    TerraformModuleWizardVarsProvider<JenkinsDTO>
{
  jenkins: JenkinsDTO;
  jenkinsForm: FormGroup;
  moduleWizardStepper: Observable<MatVerticalStepper>;
  masterCloudImages: ICloudApiImage[];
  slaveCloudImages: ICloudApiImage[];
  cloudFlavors: ICloudApiFlavor[];
  terraformPlanEvent: TerraformPlanEvent<JenkinsDTO>;
  terraformApplyEvent: TerraformApplyEvent<JenkinsDTO>;
  terraformStateOutputs: any[];
  shouldShowSensitiveData: any = {};
  showingDirectOutput = false;

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
    private jenkinsService: JenkinsService,
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
        this.masterCloudImages = cloudImages.filter(
          (img) =>
            ('openstack' === img.cloudprovider &&
              img.tags.indexOf('jenkins-master') > -1) ||
            'digitalocean' === img.cloudprovider
        );
        this.slaveCloudImages = cloudImages.filter(
          (img) =>
            ('openstack' === img.cloudprovider &&
              img.tags.indexOf('builder') > -1) || // || img.tags.indexOf('docker') > -1
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
          : this.jenkins.network_subnet_name;
      case 'digitalocean':
        return stateOutput['mgmt_network_name']
          ? stateOutput['mgmt_network_name'].value
          : this.jenkins.network_subnet_name;
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
          : this.jenkins.network_subnet_name;
      case 'digitalocean':
        return stateOutput['mgmt_network_name']
          ? stateOutput['mgmt_network_name'].value
          : this.jenkins.network_subnet_name;
      default:
        return undefined;
    }
  }

  ngOnInit() {
    this.activatedRoute.data
      .pipe(map((data) => data.moduleEntity))
      .subscribe((moduleEntity: TerraformModuleEntityInfo<JenkinsDTO>) => {
        this.jenkins = moduleEntity ? moduleEntity.entity : undefined;
        // Wait for project state to be resolved before init form
        //this.projectTfStateSubject.subscribe(()=>this.initJenkinsForm());
        this.initJenkinsForm();
      });

    this.onArchitectureTypeChanged.subscribe(
      (architectureType: string) => (this.architectureType = architectureType)
    );
    this.moduleWizardStepper.subscribe((stepper) => {
      if (this.jenkins && this.jenkins.architecture_type) {
        //setTimeout(() => (stepper.selectedIndex = 1), 1);
      }
    });
  }

  ngAfterViewChecked(): void {
    // workaround because of Expression has changed after it was checked. Previous value: 'ngIf: true' form valid
    this.cdRef.detectChanges();
  }

  initJenkinsForm() {
    this.jenkinsForm = this.formBuilder.group({
      code: [this.jenkins ? this.jenkins.code : null, Validators.required],
      master_admin_username: [
        this.jenkins ? this.jenkins.master_admin_username : 'admin',
        Validators.required,
      ],
      master_admin_password: [
        this.jenkins ? this.jenkins.master_admin_password : 'admin',
        Validators.required,
      ],
      description: [this.jenkins ? this.jenkins.description : null, null],
      use_existing_master: [
        this.jenkins ? this.jenkins.use_existing_master : false,
        null,
      ],
      network_name: [
        this.jenkins ? this.jenkins.network_name : this.projectNetwork,
        Validators.required,
      ],
      network_subnet_name: [
        this.jenkins
          ? this.jenkins.network_subnet_name
          : this.projectNetworkSubnet,
        Validators.required,
      ],
      keypair_name: [
        this.jenkins ? this.jenkins.keypair_name : this.projectKeypair,
        Validators.required,
      ],
      _master_cloud_image: [
        this.jenkins ? this.jenkins.master_cloud_image : null,
        Validators.nullValidator,
      ],
      _master_cloud_flavor: [
        this.jenkins ? this.jenkins.master_cloud_flavor : null,
        Validators.nullValidator,
      ],
      use_floating_ip: [
        this.jenkins ? this.jenkins.use_floating_ip : false,
        null,
      ],
      link_to_keycloak: [
        this.jenkins ? this.jenkins.link_to_keycloak : false,
        null,
      ],
      keycloak_client_id: [
        this.jenkins ? this.jenkins.keycloak_client_id : 'jenkins',
        null,
      ],
      existing_master_scheme: [
        this.jenkins ? this.jenkins.existing_master_scheme : 'http',
        Validators.nullValidator,
      ],
      existing_master_host: [
        this.jenkins ? this.jenkins.existing_master_host : null,
        Validators.nullValidator,
      ],
      existing_master_port: [
        this.jenkins && this.jenkins.existing_master_port
          ? this.jenkins.existing_master_port
          : 8080,
        Validators.nullValidator,
      ],
      existing_master_username: [
        this.jenkins ? this.jenkins.existing_master_username : null,
        Validators.nullValidator,
      ],
      existing_master_password: [
        this.jenkins ? this.jenkins.existing_master_password : null,
        Validators.nullValidator,
      ],
      slave_api_scheme: [
        this.jenkins ? this.jenkins.slave_api_scheme : 'http',
        Validators.nullValidator,
      ],
      slave_api_host: [
        this.jenkins ? this.jenkins.slave_api_host : null,
        Validators.nullValidator,
      ],
      slave_api_port: [
        this.jenkins && this.jenkins.existing_master_port
          ? this.jenkins.existing_master_port
          : this.jenkins && this.jenkins.slave_api_port
          ? this.jenkins.slave_api_port
          : 8080,
        Validators.nullValidator,
      ],
      slave_api_username: [
        this.jenkins ? this.jenkins.slave_api_username : 'admin',
        Validators.nullValidator,
      ],
      slave_api_token: [
        this.jenkins ? this.jenkins.slave_api_token : null,
        Validators.nullValidator,
      ],
      manage_slave: [this.jenkins ? this.jenkins.manage_slave : false, null],
      slave_groups: this.formBuilder.array(
        this.jenkins &&
          this.jenkins.slave_groups &&
          this.jenkins.slave_groups.length > 0
          ? this.jenkins.slave_groups.map((sG) =>
              this.createSlaveFormGroup(
                sG,
                this.jenkins ? this.jenkins.manage_slave : false
              )
            )
          : [
              this.createSlaveFormGroup(
                new JenkinsSlaveGroupDTO(),
                this.jenkins ? this.jenkins.manage_slave : false
              ),
            ]
      ),
    });
    if (this.jenkins && this.jenkins.code) {
      this.jenkinsForm.get('code').disable();
    }
    if (!this.jenkins) {
      this.jenkinsForm.get('manage_slave').disable();
    }
    this.jenkinsForm.get('network_name').disable();
    this.jenkinsForm.get('network_subnet_name').disable();
    this.jenkinsForm.get('keypair_name').disable();
    this.jenkinsForm.get('use_floating_ip').disable();
    this.setExistingMasterValidators();
    this.setManageSlaveValidators();
    this.jenkinsForm
      .get('slave_groups')
      .valueChanges.subscribe((slaveGroup: JenkinsSlaveGroupDTO[]) => {
        if (slaveGroup && slaveGroup.length === 0) {
          this.jenkinsForm.get('manage_slave').patchValue(false);
          if (!this.jenkinsForm.dirty) {
            this.jenkinsForm.markAsDirty();
          }
        }
      });
    this.jenkinsForm
      .get('manage_slave')
      .valueChanges.subscribe((manageSlaveGroups: boolean) => {
        if (
          manageSlaveGroups &&
          this.jenkinsForm.get('slave_groups').value.length === 0
        ) {
          this.addJenkinsSlave(null);
        }
      });
  }

  createSlaveFormGroup(
    jenkinsSlaveGroup: JenkinsSlaveGroupDTO,
    manageSlave: boolean
  ) {
    const formGroup = this.formBuilder.group({
      id: [jenkinsSlaveGroup.id ? jenkinsSlaveGroup.id : null],
      code: [jenkinsSlaveGroup.code ? jenkinsSlaveGroup.code : ''],
      labels: [jenkinsSlaveGroup.labels ? jenkinsSlaveGroup.labels : []],
      instance_count: [
        jenkinsSlaveGroup.instance_count ? jenkinsSlaveGroup.instance_count : 1,
      ],
      slave_cloud_image: [
        jenkinsSlaveGroup ? jenkinsSlaveGroup.slave_cloud_image : null,
      ],
      slave_cloud_flavor: [
        jenkinsSlaveGroup.slave_cloud_flavor
          ? jenkinsSlaveGroup.slave_cloud_flavor
          : null,
      ],
    });

    this.handleSlaveValidators(formGroup, manageSlave);

    return formGroup;
  }

  setExistingMasterValidators() {
    const masterCloudImage: AbstractControl = this.jenkinsForm.get(
      '_master_cloud_image'
    );
    const masterCloudFlavor: AbstractControl = this.jenkinsForm.get(
      '_master_cloud_flavor'
    );
    const masterAdminUsername: AbstractControl = this.jenkinsForm.get(
      'master_admin_username'
    );
    const masterAdminPassword: AbstractControl = this.jenkinsForm.get(
      'master_admin_password'
    );
    const existingMasterScheme: AbstractControl = this.jenkinsForm.get(
      'existing_master_scheme'
    );
    const existingMasterHost: AbstractControl = this.jenkinsForm.get(
      'existing_master_host'
    );
    const existingMasterPort: AbstractControl = this.jenkinsForm.get(
      'existing_master_port'
    );
    const existingMasterUsername: AbstractControl = this.jenkinsForm.get(
      'existing_master_username'
    );
    const existingMasterPassword: AbstractControl = this.jenkinsForm.get(
      'existing_master_password'
    );
    const keycloaClientId: AbstractControl =
      this.jenkinsForm.get('keycloak_client_id');
    this.jenkinsForm
      .get('use_existing_master')
      .valueChanges.subscribe((useExistingMaster: boolean) => {
        if (useExistingMaster) {
          this.resetFormControlValidatorsAndErrors(
            masterCloudImage,
            masterCloudFlavor,
            masterAdminUsername,
            masterAdminPassword
          );

          existingMasterScheme.setValidators([Validators.required]);
          existingMasterHost.setValidators([Validators.required]);
          existingMasterPort.setValidators([Validators.required]);
          existingMasterUsername.setValidators([Validators.required]);
          existingMasterPassword.setValidators([Validators.required]);
        } else {
          masterCloudImage.setValidators([Validators.required]);
          masterCloudFlavor.setValidators([Validators.required]);
          masterAdminUsername.setValidators([Validators.required]);
          masterAdminPassword.setValidators([Validators.required]);

          this.resetFormControlValidatorsAndErrors(
            existingMasterScheme,
            existingMasterHost,
            existingMasterPort,
            existingMasterUsername,
            existingMasterPassword
          );
        }
      });

    this.jenkinsForm
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
      formGroup.get('instance_count').setValidators([Validators.required]);
      formGroup.get('slave_cloud_image').setValidators([Validators.required]);
      formGroup.get('slave_cloud_flavor').setValidators([Validators.required]);
    } else {
      formGroup.get('code').setValidators([Validators.nullValidator]);
      formGroup.get('instance_count').setValidators([Validators.nullValidator]);
      formGroup
        .get('slave_cloud_image')
        .setValidators([Validators.nullValidator]);
      formGroup
        .get('slave_cloud_flavor')
        .setValidators([Validators.nullValidator]);
    }
  };

  setManageSlaveValidators() {
    const slaveGroups: FormArray = this.jenkinsForm.get(
      'slave_groups'
    ) as FormArray;
    this.jenkinsForm
      .get('manage_slave')
      .valueChanges.subscribe((manageSlave: boolean) => {
        slaveGroups.controls.forEach((formGroup) => {
          this.handleSlaveValidators(formGroup as FormGroup, manageSlave);
        });
      });
  }
  removeSlaveGroup(index: number) {
    this.confirmService.doOnConfirm(
      `Do you want to delete Slave group with index ${index}?`,
      () => {
        const slaveGroups = this.jenkinsForm.get('slave_groups') as FormArray;
        slaveGroups.removeAt(index);
      }
    );
  }

  addJenkinsSlave(jenkinsSlaveGroup: JenkinsSlaveGroupDTO) {
    const slaveGroups = this.jenkinsForm.get('slave_groups') as FormArray;
    setTimeout(() => {
      slaveGroups.push(
        this.createSlaveFormGroup(
          jenkinsSlaveGroup ? jenkinsSlaveGroup : new JenkinsSlaveGroupDTO(),
          this.jenkinsForm.get('manage_slave').value
        )
      );
    }, 1);
  }

  addSlaveGroupLabel(
    jenkinsSlaveGroup: JenkinsSlaveGroupDTO,
    event: MatChipInputEvent
  ) {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      jenkinsSlaveGroup.labels.push(value.trim());
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
  removeSlaveGroupLabel(
    jenkinsSlaveGroup: JenkinsSlaveGroupDTO,
    label: string
  ) {
    jenkinsSlaveGroup.labels.splice(
      findIndex(jenkinsSlaveGroup.labels, (l) => l === label),
      1
    );
  }

  isFormValid(): boolean {
    const formValid = this.jenkinsForm && this.jenkinsForm.valid;
    return formValid;
  }

  moduleServicePlan(moduleEntity: JenkinsDTO): Observable<any> {
    return this.jenkinsService.plan(moduleEntity);
  }

  prepareJenkinsDTOBeforeSendToServer(jenkins: JenkinsDTO) {
    // Set master image name
    if (jenkins && this.jenkinsForm.get('_master_cloud_image').value) {
      jenkins.master_cloud_image = this.toCloudProviderImageId(
        this.jenkinsForm.get('_master_cloud_image').value as ICloudApiImage
      );
      delete jenkins['_master_cloud_image'];
    }
    // Set master flavor name
    if (jenkins && this.jenkinsForm.get('_master_cloud_flavor').value) {
      jenkins.master_cloud_flavor = (
        this.jenkinsForm.get('_master_cloud_flavor').value as ICloudApiFlavor
      ).name;
      delete jenkins['_master_cloud_flavor'];
    }

    if (jenkins.manage_slave) {
      jenkins.slave_groups.forEach((slave, slaveIndex) => {
        if (!slave.id) {
          // add prefix only for new Jenkins
          slave.code = `${jenkins.code}-${slave.code.toLowerCase()}`;
        }
        slave.slave_cloud_image = this.toCloudProviderImageId(
          this.jenkinsForm.get('slave_groups').value[slaveIndex]
            .slave_cloud_image
        );
        slave.slave_cloud_flavor =
          this.jenkinsForm.get('slave_groups').value[
            slaveIndex
          ].slave_cloud_flavor.name;
      });
    } else {
      jenkins.slave_groups = [];
    }
    if (this.jenkins) {
      jenkins.id = this.jenkins.id;
    }
    jenkins.architecture_type = this.architectureType;
  }

  submitApplyPlan(jenkins: JenkinsDTO) {
    this.applyApplied.emit(jenkins);
  }

  submitPlanJenkins(jenkins: JenkinsDTO) {
    this.prepareJenkinsDTOBeforeSendToServer(jenkins);
    this.planApplied.emit(jenkins);
  }
  showJenkinsOutput(jenkins: JenkinsDTO) {
    this.showOutputApplied.emit(jenkins);
  }

  moduleServiceApplyPlan(
    moduleEntity: JenkinsDTO,
    terraformPlanEvent: TerraformPlanEvent<JenkinsDTO>
  ): Observable<any> {
    if (this.jenkins) {
      moduleEntity.id = this.jenkins.id;
    }
    const saveOrUpdateJenkins = this.jenkins
      ? this.jenkinsService.update(moduleEntity)
      : this.jenkinsService.create(moduleEntity);

    return forkJoin(
      saveOrUpdateJenkins,
      this.jenkinsService.applyPlan(
        new ApplyModuleDTO(moduleEntity, terraformPlanEvent.workingDir)
      )
    );
  }

  terraformWebsocketEventId(moduleEntity: JenkinsDTO): string {
    return moduleEntity.code;
  }

  moduleServiceTerraformState(moduleEntity: JenkinsDTO): Observable<any> {
    return this.jenkinsService.getTerraformState(moduleEntity.id);
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
