import { TerraformModuleEntityInfo } from './../../../shared/terraform/terraform-module-entity-info';
import { InstancesService } from './../../../shared/compute/instances.service';
import { ConfirmDialogService } from './../../../core/dialog/confirm-dialog/confirm-dialog.service';
import { Observable, Subject, forkJoin } from 'rxjs/';
import { MatVerticalStepper } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TerraformModuleWizardVarsProvider } from './../../../shared/terraform/terraform-module-wizard/terraform-module-wizard.component';
import {
  Component,
  OnInit,
  AfterViewChecked,
  EventEmitter,
  ChangeDetectorRef
} from '@angular/core';
import {
  InstanceDTO,
  ICloudApiImage,
  ICloudApiFlavor,
  TerraformApplyEvent,
  TerraformPlanEvent,
  ProjectDTO,
  ApplyModuleDTO
} from '@dinivas/dto';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'dinivas-instance-wizard',
  templateUrl: './instance-wizard.component.html',
  styleUrls: ['./instance-wizard.component.scss']
})
export class InstanceWizardComponent
  implements
    OnInit,
    AfterViewChecked,
    TerraformModuleWizardVarsProvider<InstanceDTO> {
  instance: InstanceDTO;
  instanceForm: FormGroup;

  moduleWizardStepper: Observable<MatVerticalStepper>;
  cloudImages: ICloudApiImage[];
  cloudFlavors: ICloudApiFlavor[];
  terraformPlanEvent: TerraformPlanEvent<InstanceDTO>;
  terraformApplyEvent: TerraformApplyEvent<InstanceDTO>;
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
  projectNetwork: { name: string; id: string };
  projectNetworkSubnet: { name: string; id: string };
  projectKeypair: string;
  projectTfStateSubject = new Subject<any>();

  constructor(
    private formBuilder: FormBuilder,
    private instancesService: InstancesService,
    private confirmService: ConfirmDialogService,
    private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef
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
      .subscribe((cloudImages: ICloudApiImage[]) => {
        this.cloudImages = cloudImages;
      });
    activatedRoute.data
      .pipe(
        map(
          (data: {
            currentProjectInfo: TerraformModuleEntityInfo<ProjectDTO>;
          }) => data.currentProjectInfo
        )
      )
      .subscribe((projectInfo: TerraformModuleEntityInfo<ProjectDTO>) => {
        this.project = projectInfo.entity;
        this.projectTfState = projectInfo.entityState;
        this.projectNetwork = this.projectTfState.outputs['mgmt_network_name']
          ? {
              name: this.projectTfState.outputs['mgmt_network_name'].value,
              id: this.projectTfState.outputs['mgmt_network_id'].value
            }
          : undefined;
        this.projectNetworkSubnet = this.projectTfState.outputs[
          'mgmt_subnet_names'
        ]
          ? {
              id: this.projectTfState.outputs['mgmt_subnet_ids'].value[0],
              name: this.projectTfState.outputs['mgmt_subnet_names'].value[0]
            }
          : undefined;
        this.projectKeypair = this.projectTfState.outputs[
          'project_keypair_name'
        ].value;
        this.projectTfStateSubject.next();
      });
  }

  ngOnInit() {
    this.activatedRoute.data
      .pipe(
        map((data: { moduleEntity: TerraformModuleEntityInfo<InstanceDTO> }) =>
          data.moduleEntity ? data.moduleEntity.entity : undefined
        )
      )
      .subscribe((instance: InstanceDTO) => {
        this.instance = instance;
        this.initInstanceForm();
      });

    this.onArchitectureTypeChanged.subscribe(
      (architectureType: string) => (this.architectureType = architectureType)
    );
  }

  ngAfterViewChecked(): void {
    // workaround because of Expression has changed after it was checked. Previous value: 'ngIf: true' form valid
    this.cdRef.detectChanges();
  }

  initInstanceForm() {
    this.instanceForm = this.formBuilder.group({
      code: [this.instance ? this.instance.code : null, Validators.required],
      description: [this.instance ? this.instance.description : null, null],
      network_name: [
        this.instance ? this.instance.network_name : this.projectNetwork.name,
        Validators.required
      ],
      network_subnet_name: [
        this.instance
          ? this.instance.network_subnet_name
          : this.projectNetworkSubnet.name,
        Validators.required
      ],
      keypair_name: [
        this.instance ? this.instance.keypair_name : this.projectKeypair,
        Validators.required
      ],
      _cluster_cloud_image: [
        this.instance ? this.instance.cloud_image : null,
        Validators.nullValidator
      ],
      _cluster_cloud_flavor: [
        this.instance ? this.instance.cloud_flavor : null,
        Validators.nullValidator
      ],
      use_floating_ip: [
        this.instance ? this.instance.use_floating_ip : false,
        null
      ]
    });
    if (this.instance && this.instance.code) {
      this.instanceForm.get('code').disable();
    }
    this.instanceForm.get('network_name').disable();
    this.instanceForm.get('network_subnet_name').disable();
    this.instanceForm.get('keypair_name').disable();
  }

  isFormValid(): boolean {
    const formValid = this.instanceForm && this.instanceForm.valid;
    return formValid;
  }

  moduleServicePlan(moduleEntity: InstanceDTO): Observable<any> {
    return this.instancesService.plan(moduleEntity);
  }

  submitApplyPlan(instance: InstanceDTO) {
    this.applyApplied.emit(instance);
  }

  submitPlanInstance(instance: InstanceDTO) {
    this.prepareInstanceDTOBeforeSendToServer(instance);
    this.planApplied.emit(instance);
  }

  moduleServiceApplyPlan(
    moduleEntity: InstanceDTO,
    terraformPlanEvent: TerraformPlanEvent<InstanceDTO>
  ): Observable<any> {
    if (this.instance) {
      moduleEntity.id = this.instance.id;
    }
    const saveOrUpdateInstance = this.instance
      ? this.instancesService.update(moduleEntity)
      : this.instancesService.create(moduleEntity);

    return forkJoin(
      saveOrUpdateInstance,
      this.instancesService.applyPlan(
        new ApplyModuleDTO(moduleEntity, terraformPlanEvent.workingDir)
      )
    );
  }

  prepareInstanceDTOBeforeSendToServer(instance: InstanceDTO) {
    if (!this.instance) {
      // add prefix only for new instance
      instance.code = `${this.project.code.toLowerCase()}-${instance.code.toLowerCase()}`;
    }
    if (instance && this.instanceForm.get('_cluster_cloud_image').value) {
      instance.cloud_image = (this.instanceForm.get('_cluster_cloud_image')
        .value as ICloudApiImage).name;
      delete instance['_cluster_cloud_image'];
    }
    if (instance && this.instanceForm.get('_cluster_cloud_flavor').value) {
      instance.cloud_flavor = (this.instanceForm.get('_cluster_cloud_flavor')
        .value as ICloudApiFlavor).name;
      delete instance['_cluster_cloud_flavor'];
    }
    if (this.instance) {
      instance.id = this.instance.id;
    }
    instance.availability_zone = this.project.availability_zone;
  }

  terraformWebsocketEventId(moduleEntity: InstanceDTO): string {
    return moduleEntity.code;
  }

  moduleServiceTerraformState(moduleEntity: InstanceDTO): Observable<any> {
    return this.instancesService.getTerraformState(moduleEntity.id);
  }
}
