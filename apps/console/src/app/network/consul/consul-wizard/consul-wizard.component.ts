import { ConfirmDialogService } from './../../../core/dialog/confirm-dialog/confirm-dialog.service';
import { ConsulService } from './../../../shared/consul/consul.service';
import { MatVerticalStepper } from '@angular/material';
import { Observable, Subject, forkJoin, of } from 'rxjs/';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TerraformModuleWizardVarsProvider } from './../../../shared/terraform/terraform-module-wizard/terraform-module-wizard.component';
import {
  ConsulDTO,
  ICloudApiImage,
  ICloudApiFlavor,
  ProjectDTO,
  TerraformPlanEvent,
  TerraformApplyEvent,
  ApplyModuleDTO
} from '@dinivas/dto';
import {
  Component,
  OnInit,
  EventEmitter,
  ChangeDetectorRef,
  AfterViewChecked
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { TerraformModuleEntityInfo } from '../../../shared/terraform/terraform-module-entity-info';

@Component({
  selector: 'dinivas-consul-wizard',
  templateUrl: './consul-wizard.component.html'
})
export class ConsulWizardComponent
  implements
    OnInit,
    AfterViewChecked,
    TerraformModuleWizardVarsProvider<ConsulDTO> {
  consul: ConsulDTO;
  consulForm: FormGroup;
  moduleWizardStepper: Observable<MatVerticalStepper>;
  cloudImages: ICloudApiImage[];
  cloudFlavors: ICloudApiFlavor[];
  erraformPlanEvent: TerraformPlanEvent<ConsulDTO>;
  terraformApplyEvent: TerraformApplyEvent<ConsulDTO>;
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
  constructor(
    private formBuilder: FormBuilder,
    private consulService: ConsulService,
    private confirmService: ConfirmDialogService,
    private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef
  ) {
    activatedRoute.data
      .pipe(map((data: { cloudImages: ICloudApiImage[] }) => data.cloudImages))
      .subscribe(
        (cloudImages: ICloudApiImage[]) => (this.cloudImages = cloudImages)
      );
    activatedRoute.data
      .pipe(
        map((data: { cloudFlavors: ICloudApiFlavor[] }) => data.cloudFlavors)
      )
      .subscribe(
        (cloudFlavors: ICloudApiFlavor[]) => (this.cloudFlavors = cloudFlavors)
      );
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
          ? this.projectTfState.outputs['mgmt_network_name'].value
          : undefined;
        this.projectNetworkSubnet = this.projectTfState.outputs[
          'mgmt_subnet_names'
        ]
          ? this.projectTfState.outputs['mgmt_subnet_names'].value[0]
          : this.consul.network_subnet_name;
        this.projectKeypair = this.projectTfState.outputs[
          'project_keypair_name'
        ].value;
        this.projectTfStateSubject.next();
      });
  }

  ngOnInit() {
    this.activatedRoute.data
      .pipe(map((data: {moduleEntity: TerraformModuleEntityInfo<ConsulDTO>}) => data.moduleEntity))
      .subscribe((moduleEntity: TerraformModuleEntityInfo<ConsulDTO>) => {
        this.consul = moduleEntity ? moduleEntity.entity : undefined;
        this.initConsulForm();
      });

    this.onArchitectureTypeChanged.subscribe(
      (architectureType: string) => (this.architectureType = architectureType)
    );
    this.moduleWizardStepper.subscribe(stepper => {
      if (this.consul && this.consul.architecture_type) {
        //setTimeout(() => (stepper.selectedIndex = 1), 1);
      }
    });
  }

  ngAfterViewChecked(): void {
    // workaround because of Expression has changed after it was checked. Previous value: 'ngIf: true' form valid
    this.cdRef.detectChanges();
  }

  initConsulForm() {
    this.consulForm = this.formBuilder.group({
      code: [this.consul ? this.consul.code : null, Validators.required],
      cluster_domain: [
        this.consul ? this.consul.cluster_domain : null,
        Validators.required
      ],
      description: [this.consul ? this.consul.description : null, null],
      network_name: [
        this.consul ? this.consul.network_name : this.projectNetwork,
        Validators.required
      ],
      network_subnet_name: [
        this.consul
          ? this.consul.network_subnet_name
          : this.projectNetworkSubnet,
        Validators.required
      ],
      keypair_name: [
        this.consul ? this.consul.keypair_name : this.projectKeypair,
        Validators.required
      ],
      server_instance_count: [
        this.consul ? this.consul.server_instance_count : 1
      ],
      _server_image: [
        this.consul ? this.consul.server_image : null,
        Validators.nullValidator
      ],
      _server_flavor: [
        this.consul ? this.consul.server_flavor : null,
        Validators.nullValidator
      ],
      client_instance_count: [
        this.consul ? this.consul.client_instance_count : 1
      ],
      _client_image: [
        this.consul ? this.consul.client_image : null,
        Validators.nullValidator
      ],
      _client_flavor: [
        this.consul ? this.consul.client_flavor : null,
        Validators.nullValidator
      ],
      use_floating_ip: [this.consul ? this.consul.use_floating_ip : false, null]
    });
    this.consulForm.get('network_name').disable();
    this.consulForm.get('network_subnet_name').disable();
    this.consulForm.get('keypair_name').disable();
  }

  isFormValid(): boolean {
    const formValid = this.consulForm && this.consulForm.valid;
    return formValid;
  }
  moduleServicePlan(moduleEntity: ConsulDTO): Observable<any> {
    return this.consulService.plan(moduleEntity);
  }

  prepareConsulDTOBeforeSendToServer(consul: ConsulDTO) {
    // Set server image name
    if (consul && this.consulForm.get('_server_image').value) {
      consul.server_image = (this.consulForm.get('_server_image')
        .value as ICloudApiImage).name;
      delete consul['_server_image'];
    }
    // Set server flavor name
    if (consul && this.consulForm.get('_server_flavor').value) {
      consul.server_flavor = (this.consulForm.get('_server_flavor')
        .value as ICloudApiFlavor).name;
      delete consul['_server_flavor'];
    }
    // Set client image name
    if (consul && this.consulForm.get('_client_image').value) {
      consul.client_image = (this.consulForm.get('_client_image')
        .value as ICloudApiImage).name;
      delete consul['_client_image'];
    }
    // Set client flavor name
    if (consul && this.consulForm.get('_client_flavor').value) {
      consul.client_flavor = (this.consulForm.get('_client_flavor')
        .value as ICloudApiFlavor).name;
      delete consul['_client_flavor'];
    }

    // add project code preffix to consul code and all slave code
    if (!this.consul) {
      // add prefix only for new Consul cluster
      consul.code = `${this.project.code.toLowerCase()}-${consul.code.toLowerCase()}`;
    }

    if (this.consul) {
      consul.id = this.consul.id;
    }
    consul.architecture_type = this.architectureType;
  }

  submitApplyPlan(consul: ConsulDTO) {
    this.applyApplied.emit(consul);
  }

  submitPlanConsul(consul: ConsulDTO) {
    this.prepareConsulDTOBeforeSendToServer(consul);
    this.planApplied.emit(consul);
  }
  showConsulOutput(consul: ConsulDTO) {
    this.showOutputApplied.emit(consul);
  }

  moduleServiceApplyPlan(
    moduleEntity: ConsulDTO,
    terraformPlanEvent: TerraformPlanEvent<ConsulDTO>
  ): Observable<any> {
    if (this.consul) {
      moduleEntity.id = this.consul.id;
    }
    const saveOrUpdateConsul = this.consul
      ? this.consulService.update(moduleEntity)
      : this.consulService.create(moduleEntity);

    return forkJoin(
      saveOrUpdateConsul,
      this.consulService.applyPlan(
        new ApplyModuleDTO(moduleEntity, terraformPlanEvent.workingDir)
      )
    );
  }

  terraformWebsocketEventId(moduleEntity: ConsulDTO): string {
    return moduleEntity.code;
  }

  moduleServiceTerraformState(moduleEntity: ConsulDTO): Observable<any> {
    return this.consul.managed_by_project
      ? of(null)
      : this.consulService.getTerraformState(moduleEntity.id);
  }
}
