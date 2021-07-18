import { ConfirmDialogService } from './../../../core/dialog/confirm-dialog/confirm-dialog.service';
import { RabbitMQService } from './../../../shared/rabbitmq/rabbitmq.service';
import { Observable, Subject, forkJoin } from 'rxjs';
import { MatVerticalStepper } from '@angular/material/stepper';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  RabbitMQDTO,
  ICloudApiImage,
  ICloudApiFlavor,
  TerraformPlanEvent,
  TerraformApplyEvent,
  ProjectDTO,
  ApplyModuleDTO,
} from '@dinivas/api-interfaces';
import { TerraformModuleWizardVarsProvider } from './../../../shared/terraform/terraform-module-wizard/terraform-module-wizard.component';
import {
  Component,
  OnInit,
  EventEmitter,
  ChangeDetectorRef,
  AfterViewChecked,
} from '@angular/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { TerraformModuleEntityInfo } from '../../../shared/terraform/terraform-module-entity-info';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'dinivas-rabbitmq-wizard',
  templateUrl: './rabbitmq-wizard.component.html',
  styleUrls: ['./rabbitmq-wizard.component.scss'],
})
export class RabbitmqWizardComponent
  implements
    OnInit,
    AfterViewChecked,
    TerraformModuleWizardVarsProvider<RabbitMQDTO>
{
  rabbitmq: RabbitMQDTO;
  rabbitmqForm: FormGroup;

  moduleWizardStepper: Observable<MatVerticalStepper>;
  cloudImages: ICloudApiImage[];
  cloudFlavors: ICloudApiFlavor[];
  terraformPlanEvent: TerraformPlanEvent<RabbitMQDTO>;
  terraformApplyEvent: TerraformApplyEvent<RabbitMQDTO>;
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

  availableRabbitmqPlugins: string[] = [
    'rabbitmq_amqp1_0',
    'rabbitmq_federation',
    'rabbitmq_federation_management',
    'rabbitmq_mqtt',
    'rabbitmq_shovel',
    'rabbitmq_shovel_management',
    'rabbitmq_stomp',
  ];
  preSelectedRabbitmqPlugins: string[] = [
    'rabbitmq_management',
    'rabbitmq_management_agent',
    'rabbitmq_prometheus',
    'rabbitmq_peer_discovery_consul',
  ];

  selectedRabbitmqPlugins: string[] = Array.from(
    this.preSelectedRabbitmqPlugins
  );
  remainingAvailableRabbitmqPlugins: string[] = Array.from(
    this.availableRabbitmqPlugins
  );

  constructor(
    private formBuilder: FormBuilder,
    private rabbitmqService: RabbitMQService,
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
        this.cloudImages = cloudImages.filter(
          (img) => img.tags.indexOf('rabbitmq') > -1
        );
      });
    activatedRoute.data
      .pipe(map((data) => data.currentProjectInfo))
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
          : this.rabbitmq.network_subnet_name;
        this.projectKeypair =
          this.projectTfState.outputs['project_keypair_name'].value;
        this.projectTfStateSubject.next(undefined);
      });
  }

  ngOnInit() {
    this.activatedRoute.data
      .pipe(
        map((data) =>
          data.moduleEntity ? data.moduleEntity.entity : undefined
        )
      )
      .subscribe((rabbitmq: RabbitMQDTO) => {
        this.rabbitmq = rabbitmq;
        this.initRabbitMQForm();
      });

    this.onArchitectureTypeChanged.subscribe(
      (architectureType: string) => (this.architectureType = architectureType)
    );
    this.moduleWizardStepper.subscribe((stepper) => {
      if (this.rabbitmq && this.rabbitmq.architecture_type) {
        //setTimeout(() => (stepper.selectedIndex = 1), 1);
      }
    });
  }

  ngAfterViewChecked(): void {
    // workaround because of Expression has changed after it was checked. Previous value: 'ngIf: true' form valid
    this.cdRef.detectChanges();
  }

  addPluginToSelected(event: MatAutocompleteSelectedEvent) {
    this.selectedRabbitmqPlugins.push(event.option.viewValue);
    this.remainingAvailableRabbitmqPlugins.splice(
      this.remainingAvailableRabbitmqPlugins.indexOf(event.option.viewValue),
      1
    );
  }

  removePLugin(plugin: string) {
    if (this.availableRabbitmqPlugins.indexOf(plugin) > -1) {
      this.remainingAvailableRabbitmqPlugins.push(plugin);
      this.selectedRabbitmqPlugins.splice(
        this.selectedRabbitmqPlugins.indexOf(plugin),
        1
      );
    }
  }

  initRabbitMQForm() {
    this.rabbitmqForm = this.formBuilder.group({
      code: [this.rabbitmq ? this.rabbitmq.code : null, Validators.required],
      description: [this.rabbitmq ? this.rabbitmq.description : null, null],
      network_name: [
        this.rabbitmq ? this.rabbitmq.network_name : this.projectNetwork,
        Validators.required,
      ],
      network_subnet_name: [
        this.rabbitmq
          ? this.rabbitmq.network_subnet_name
          : this.projectNetworkSubnet,
        Validators.required,
      ],
      keypair_name: [
        this.rabbitmq ? this.rabbitmq.keypair_name : this.projectKeypair,
        Validators.required,
      ],
      _cluster_cloud_image: [
        this.rabbitmq ? this.rabbitmq.cluster_cloud_image : null,
        Validators.nullValidator,
      ],
      _cluster_cloud_flavor: [
        this.rabbitmq ? this.rabbitmq.cluster_cloud_flavor : null,
        Validators.nullValidator,
      ],
      use_floating_ip: [
        this.rabbitmq ? this.rabbitmq.use_floating_ip : false,
        null,
      ],
      cluster_instance_count: [
        this.rabbitmq ? this.rabbitmq.cluster_instance_count : 1,
        Validators.required,
      ],
      _enabled_plugin_list: [
        this.rabbitmq
          ? this.rabbitmq.enabled_plugin_list.split(',')
          : this.selectedRabbitmqPlugins,
        Validators.required,
      ],
    });
    if (this.rabbitmq && this.rabbitmq.code) {
      this.rabbitmqForm.get('code').disable();
    }
    this.rabbitmqForm.get('network_name').disable();
    this.rabbitmqForm.get('network_subnet_name').disable();
    this.rabbitmqForm.get('keypair_name').disable();
  }

  isFormValid(): boolean {
    const formValid = this.rabbitmqForm && this.rabbitmqForm.valid;
    return formValid;
  }

  moduleServicePlan(moduleEntity: RabbitMQDTO): Observable<any> {
    return this.rabbitmqService.plan(moduleEntity);
  }

  submitApplyPlan(rabbitmq: RabbitMQDTO) {
    this.applyApplied.emit(rabbitmq);
  }

  submitPlanRabbitMQ(rabbitmq: RabbitMQDTO) {
    this.prepareRabbitMQDTOBeforeSendToServer(rabbitmq);
    this.planApplied.emit(rabbitmq);
  }

  moduleServiceApplyPlan(
    moduleEntity: RabbitMQDTO,
    terraformPlanEvent: TerraformPlanEvent<RabbitMQDTO>
  ): Observable<any> {
    if (this.rabbitmq) {
      moduleEntity.id = this.rabbitmq.id;
    }
    const saveOrUpdateRabbitMQ = this.rabbitmq
      ? this.rabbitmqService.update(moduleEntity)
      : this.rabbitmqService.create(moduleEntity);

    return forkJoin(
      saveOrUpdateRabbitMQ,
      this.rabbitmqService.applyPlan(
        new ApplyModuleDTO(moduleEntity, terraformPlanEvent.workingDir)
      )
    );
  }

  terraformWebsocketEventId(moduleEntity: RabbitMQDTO): string {
    return moduleEntity.code;
  }

  moduleServiceTerraformState(moduleEntity: RabbitMQDTO): Observable<any> {
    return this.rabbitmqService.getTerraformState(moduleEntity.id);
  }

  prepareRabbitMQDTOBeforeSendToServer(rabbitmq: RabbitMQDTO) {
    if (!this.rabbitmq) {
      // add prefix only for new RabbitMQ cluster
      rabbitmq.code = `${this.project.code.toLowerCase()}-${rabbitmq.code.toLowerCase()}`;
    }
    if (rabbitmq && this.rabbitmqForm.get('_cluster_cloud_image').value) {
      rabbitmq.cluster_cloud_image = (
        this.rabbitmqForm.get('_cluster_cloud_image').value as ICloudApiImage
      ).name;
      delete rabbitmq['_cluster_cloud_image'];
    }
    if (rabbitmq && this.rabbitmqForm.get('_cluster_cloud_flavor').value) {
      rabbitmq.cluster_cloud_flavor = (
        this.rabbitmqForm.get('_cluster_cloud_flavor').value as ICloudApiFlavor
      ).name;
      delete rabbitmq['_cluster_cloud_flavor'];
    }
    if (this.rabbitmq) {
      rabbitmq.id = this.rabbitmq.id;
    }
    rabbitmq.architecture_type = this.architectureType;
    rabbitmq.enabled_plugin_list = this.rabbitmqForm
      .get('_enabled_plugin_list')
      .value.join(',');
    delete rabbitmq['_enabled_plugin_list'];
    rabbitmq.cluster_availability_zone = this.project.availability_zone;
  }

  showRabbitMQOutput(event: any) {}
}
