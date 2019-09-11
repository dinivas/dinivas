import { ConfirmDialogService } from './../../../core/dialog/confirm-dialog/confirm-dialog.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { TerraformModuleWizardVarsProvider } from './../../../shared/terraform/terraform-module-wizard/terraform-module-wizard.component';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { JenkinsService } from './../../../shared/jenkins/jenkins.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  AbstractControl
} from '@angular/forms';
import {
  JenkinsDTO,
  ICloudApiImage,
  ICloudApiFlavor,
  TerraformPlanEvent,
  TerraformApplyEvent,
  JenkinsSlaveGroupDTO,
  ProjectDTO,
  ApplyModuleDTO
} from '@dinivas/dto';
import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { MatVerticalStepper, MatChipInputEvent } from '@angular/material';
import { Observable, Subject, forkJoin } from 'rxjs';
import { findIndex } from 'lodash';

@Component({
  selector: 'dinivas-jenkins-wizard',
  templateUrl: './jenkins-wizard.component.html'
})
export class JenkinsWizardComponent
  implements OnInit, TerraformModuleWizardVarsProvider<JenkinsDTO> {
  jenkins: JenkinsDTO;
  jenkinsForm: FormGroup;
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
    activatedRoute.data
      .pipe(
        map(
          (data: {
            currentProjectInfo: { project: ProjectDTO; projectState: any };
          }) => data.currentProjectInfo
        )
      )
      .subscribe((projectInfo: { project: ProjectDTO; projectState: any }) => {
        this.project = projectInfo.project;
        this.projectTfState = projectInfo.projectState;
        this.projectNetwork = this.projectTfState.outputs['mgmt_network_name']
          ? this.projectTfState.outputs['mgmt_network_name'].value
          : undefined;
        this.projectNetworkSubnet = this.projectTfState.outputs[
          'mgmt_subnet_names'
        ]
          ? this.projectTfState.outputs['mgmt_subnet_names'].value[0]
          : this.jenkins.network_subnet_name;
        this.projectKeypair = this.projectTfState.outputs[
          'project_keypair_name'
        ].value;
        this.projectTfStateSubject.next();
      });
  }

  ngOnInit() {
    this.activatedRoute.data
      .pipe(map((data: { moduleEntity: JenkinsDTO }) => data.moduleEntity))
      .subscribe((jenkins: JenkinsDTO) => {
        this.jenkins = jenkins;
        // Wait for project state to be resolved before init form
        //this.projectTfStateSubject.subscribe(()=>this.initJenkinsForm());
        this.initJenkinsForm();
      });

    this.onArchitectureTypeChanged.subscribe(
      (architectureType: string) => (this.architectureType = architectureType)
    );
  }
  initJenkinsForm() {
    this.jenkinsForm = this.formBuilder.group({
      code: [this.jenkins ? this.jenkins.code : null, Validators.required],
      master_admin_username: [
        this.jenkins ? this.jenkins.master_admin_username : 'admin',
        Validators.required
      ],
      master_admin_password: [
        this.jenkins ? this.jenkins.master_admin_password : 'password',
        Validators.required
      ],
      description: [this.jenkins ? this.jenkins.description : null, null],
      use_existing_master: [
        this.jenkins ? this.jenkins.use_existing_master : false,
        null
      ],
      network_name: [
        this.jenkins ? this.jenkins.network_name : this.projectNetwork,
        Validators.required
      ],
      network_subnet_name: [
        this.jenkins ? this.jenkins.network_subnet_name : this.projectNetworkSubnet,
        Validators.required
      ],
      keypair_name: [
        this.jenkins ? this.jenkins.keypair_name : this.projectKeypair,
        Validators.required
      ],
      master_cloud_image: [
        this.jenkins ? this.jenkins.master_cloud_image : null,
        Validators.nullValidator
      ],
      master_cloud_flavor: [
        this.jenkins ? this.jenkins.master_cloud_flavor : null,
        Validators.nullValidator
      ],
      use_floating_ip: [
        this.jenkins ? this.jenkins.use_floating_ip : false,
        null
      ],
      existing_master_url: [
        this.jenkins ? this.jenkins.existing_master_url : null,
        Validators.nullValidator
      ],
      existing_master_username: [
        this.jenkins ? this.jenkins.existing_master_username : null,
        Validators.nullValidator
      ],
      existing_master_password: [
        this.jenkins ? this.jenkins.existing_master_password : null,
        Validators.nullValidator
      ],
      manage_slave: [this.jenkins ? this.jenkins.manage_slave : false, null],
      slave_groups: this.formBuilder.array(
        this.jenkins &&
          this.jenkins.slave_groups &&
          this.jenkins.slave_groups.length > 0
          ? this.jenkins.slave_groups.map(sG =>
              this.createSlaveFormGroup(
                sG,
                this.jenkins ? this.jenkins.manage_slave : false
              )
            )
          : [
              this.createSlaveFormGroup(
                new JenkinsSlaveGroupDTO(),
                this.jenkins ? this.jenkins.manage_slave : false
              )
            ]
      )
    });
    if (this.jenkins && this.jenkins.code) {
      this.jenkinsForm.get('code').disable();
    }
    this.jenkinsForm.get('network_name').disable();
    this.jenkinsForm.get('network_subnet_name').disable();
    this.jenkinsForm.get('keypair_name').disable();
    this.setExistingMasterValidators();
    this.setManageSlaveValidators();
  }

  createSlaveFormGroup(
    jenkinsSlaveGroup: JenkinsSlaveGroupDTO,
    manageSlave: boolean
  ) {
    const formGroup = this.formBuilder.group({
      code: [jenkinsSlaveGroup.code ? jenkinsSlaveGroup.code : ''],
      labels: [jenkinsSlaveGroup.labels ? jenkinsSlaveGroup.labels : []],
      instance_count: [
        jenkinsSlaveGroup.instance_count ? jenkinsSlaveGroup.instance_count : 1
      ],
      slave_cloud_image: [
        jenkinsSlaveGroup ? jenkinsSlaveGroup.slave_cloud_image : null
      ],
      slave_cloud_flavor: [
        jenkinsSlaveGroup.slave_cloud_flavor
          ? jenkinsSlaveGroup.slave_cloud_flavor
          : null
      ]
    });
    setTimeout(() => {
      this.handleSlaveValidators(formGroup, manageSlave);
    }, 2);
    return formGroup;
  }

  setExistingMasterValidators() {
    const masterCloudImage: AbstractControl = this.jenkinsForm.get(
      'master_cloud_image'
    );
    const masterCloudFlavor: AbstractControl = this.jenkinsForm.get(
      'master_cloud_flavor'
    );
    const masterAdminUsername: AbstractControl = this.jenkinsForm.get(
      'master_admin_username'
    );
    const masterAdminPassword: AbstractControl = this.jenkinsForm.get(
      'master_admin_password'
    );
    const existingMasterUrl: AbstractControl = this.jenkinsForm.get(
      'existing_master_url'
    );
    const existingMasterUsername: AbstractControl = this.jenkinsForm.get(
      'existing_master_username'
    );
    const existingMasterPassword: AbstractControl = this.jenkinsForm.get(
      'existing_master_password'
    );
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

          existingMasterUrl.setValidators([Validators.required]);
          existingMasterUsername.setValidators([Validators.required]);
          existingMasterPassword.setValidators([Validators.required]);
        } else {
          masterCloudImage.setValidators([Validators.required]);
          masterCloudFlavor.setValidators([Validators.required]);
          masterAdminUsername.setValidators([Validators.required]);
          masterAdminPassword.setValidators([Validators.required]);

          this.resetFormControlValidatorsAndErrors(
            existingMasterUrl,
            existingMasterUsername,
            existingMasterPassword
          );
        }
      });
  }

  resetFormControlValidatorsAndErrors(...formControls: AbstractControl[]) {
    formControls.forEach(fC => {
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
        slaveGroups.controls.forEach((formGroup: FormGroup) => {
          this.handleSlaveValidators(formGroup, manageSlave);
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
    slaveGroups.push(
      this.createSlaveFormGroup(
        jenkinsSlaveGroup ? jenkinsSlaveGroup : new JenkinsSlaveGroupDTO(),
        this.jenkinsForm.get('manage_slave').value
      )
    );
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
      findIndex(jenkinsSlaveGroup.labels, l => l === label),
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
    // add project code preffix to jenkins code and all slave code
    jenkins.code = `${this.project.code.toLowerCase()}-${jenkins.code.toLowerCase()}`;
    if (jenkins.manage_slave) {
      jenkins.slave_groups.forEach(
        slave => (slave.code = `${jenkins.code}-${slave.code.toLowerCase()}`)
      );
    } else {
      jenkins.slave_groups = [];
    }
    if (this.jenkins) {
      jenkins.id = this.jenkins.id;
    }
  }

  submitApplyPlan(jenkins: JenkinsDTO) {
    this.applyApplied.emit(jenkins);
  }

  submitPlanJenkins(jenkins: JenkinsDTO) {
    this.prepareJenkinsDTOBeforeSendToServer(jenkins);
    this.planApplied.emit(jenkins);
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
}
