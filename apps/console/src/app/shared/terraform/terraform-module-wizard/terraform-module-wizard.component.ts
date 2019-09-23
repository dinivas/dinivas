import { AlertService } from './../../../core/alert/alert.service';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { TerraformModuleWizardVarsDirective } from './terraform-module-wizard-vars.directive';
import { ActivatedRoute } from '@angular/router';
import { TerraformWebSocket } from '../terraform-websocket.service';
import {
  Component,
  OnInit,
  ViewChild,
  ComponentFactoryResolver,
  ElementRef,
  ComponentRef
} from '@angular/core';
import { MatVerticalStepper } from '@angular/material';
import {
  TerraformApplyEvent,
  TerraformPlanEvent,
  ICloudApiImage,
  ICloudApiFlavor
} from '@dinivas/dto';
import { Observable, Subscription, Subject } from 'rxjs';
import { TerraformModuleWizard } from './terraform-module-wizard';

@Component({
  selector: 'dinivas-terraform-module-wizard',
  templateUrl: './terraform-module-wizard.component.html',
  styleUrls: ['./terraform-module-wizard.component.scss']
})
export class TerraformModuleWizardComponent<T> implements OnInit {
  // Variables that contains all input datas
  moduleWizard: TerraformModuleWizard<T>;

  varsProvider: TerraformModuleWizardVarsProvider<T>;

  planStepFinished = false;
  applyStepFinished = false;
  planInProgress = false;
  applyInProgress = false;
  wizardStepper: MatVerticalStepper;
  _wizardStepper = new Subject<MatVerticalStepper>();
  @ViewChild(MatVerticalStepper, { static: false })
  set _wizardStepperRef(stepper: MatVerticalStepper) {
    this.wizardStepper = stepper;
    this._wizardStepper.next(this.wizardStepper);
  }

  isLinear = true;

  terraformPlanEvent: TerraformPlanEvent<T>;
  terraformApplyEvent: TerraformApplyEvent<T>;
  terraformStateOutputs: any[];
  shouldShowSensitiveData: any = {};
  showingDirectOutput = false;
  architectureTypes: {
    code: string;
    label: string;
    disabled: boolean;
    description: string;
  }[] = [];
  cloudImages: ICloudApiImage[];
  cloudFlavors: ICloudApiFlavor[];
  architectureType: string;
  architectureTypeForm: FormGroup;

  @ViewChild(TerraformModuleWizardVarsDirective, { static: true })
  terraformModuleWizardVarsDirective: TerraformModuleWizardVarsDirective;

  childConponentRef: ComponentRef<any>;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private readonly terraformWebSocket: TerraformWebSocket,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => {
      this.moduleWizard = data.moduleWizard;
      this.moduleWizard.moduleEntity = data.moduleEntity;
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
        this.moduleWizard.component
      );

      const viewContainerRef = this.terraformModuleWizardVarsDirective
        .viewContainerRef;
      viewContainerRef.clear();

      const componentRef = viewContainerRef.createComponent(componentFactory);
      (<any>(
        componentRef.instance
      )).planApplied = this.terraformModuleWizardVarsDirective.planApplied;
      (<any>(
        componentRef.instance
      )).showOutputApplied = this.terraformModuleWizardVarsDirective.showOutputApplied;
      (<any>(
        componentRef.instance
      )).applyApplied = this.terraformModuleWizardVarsDirective.applyApplied;
      (<any>(
        componentRef.instance
      )).onArchitectureTypeChanged = this.terraformModuleWizardVarsDirective.onArchitectureTypeChanged;
      this.childConponentRef = componentRef;
      (<any>(
        this.childConponentRef.instance
      )).moduleWizardStepper = this._wizardStepper.asObservable();
      this.varsProvider = <any>componentRef.instance;
      this.initArchitectureTypeSelection();
    });
  }
  initArchitectureTypeSelection() {
    if (this.shouldSelectArchitecture()) {
      this.architectureTypes.push({
        code: 'singletier',
        label: 'Single-Tier',
        disabled: !this.moduleWizard.supportSingleTier,
        description: 'Simple architecture based on only one instance, NO HA'
      });
      this.architectureTypes.push({
        code: 'multitier',
        label: 'Multi-Tier',
        disabled: !this.moduleWizard.supportMultiTier,
        description:
          'High Availability architecture based on multiple instance with load balancing'
      });
      this.architectureTypes.push({
        code: 'docker',
        label: 'Docker Container',
        disabled: !this.moduleWizard.supportDocker,
        description: 'Deploy a docker container on one Instance'
      });
      this.architectureTypes.push({
        code: 'kubernetes',
        label: 'Kubernetes',
        disabled: !this.moduleWizard.supportKubernetes,
        description: 'Deploy on existing Kubernetes cluster using Helm chart'
      });
      this.architectureTypeForm = this.formBuilder.group({
        architecture_type: [
          this.architectureType ? this.architectureType : null,
          Validators.required
        ]
      });
      this.architectureTypeForm
        .get('architecture_type')
        .valueChanges.subscribe((architectureType: string) => {
          this.terraformModuleWizardVarsDirective.onArchitectureTypeChanged.emit(
            architectureType
          );
        });
      if (
        this.moduleWizard.moduleEntity &&
        this.moduleWizard.moduleEntity['architecture_type']
      ) {
        this.architectureTypeForm
          .get('architecture_type')
          .patchValue(this.moduleWizard.moduleEntity['architecture_type']);
      }
    }
  }
  onSelectArchitectureType($event, architectureTypeForm: NgForm) {}

  submitApplyPlan(moduleEntity: T) {
    this.varsProvider.submitApplyPlan(moduleEntity);
  }
  onPlanApplied($event) {
    this.planInProgress = true;
    this.planStepFinished = false;
    setTimeout(() => this.planModule($event), 1);
  }

  onApplyApplied($event) {
    this.applyInProgress = true;
    this.applyStepFinished = false;
    setTimeout(() => this.applyPlan($event), 1);
  }

  planModule(moduleEntity: T) {
    this.terraformPlanEvent = null;
    this.moduleWizard.moduleEntity = moduleEntity;
    this.varsProvider.moduleServicePlan(moduleEntity).subscribe(
      () => {
        const planEventSuSubscription = this.terraformWebSocket
          .receivePlanEvent(
            this.varsProvider.terraformWebsocketEventId(moduleEntity)
          )
          .subscribe((data: TerraformPlanEvent<T>) => {
            console.log('Receive TerraformPlanEvent from Terrform WS', data);
            planEventSuSubscription.unsubscribe();
            this.terraformPlanEvent = data;
            this.planInProgress = false;
            this.planStepFinished = true;
            setTimeout(() => {
              this.wizardStepper.next();
            }, 1);
          });
        this.terraformWebSocket
          .receivePlanErrorEvent(
            this.varsProvider.terraformWebsocketEventId(moduleEntity)
          )
          .subscribe((error: string) => {
            this.alertService.error(error);
            this.planInProgress = false;
            this.planStepFinished = false;
          });
      },
      error => {
        this.planInProgress = false;
        this.planStepFinished = false;
      }
    );
  }

  applyPlan(moduleEntity: T) {
    this.varsProvider
      .moduleServiceApplyPlan(moduleEntity, this.terraformPlanEvent)
      .subscribe(
        () => {
          const applySubscription = this.terraformWebSocket
            .receiveApplyEvent(
              this.varsProvider.terraformWebsocketEventId(moduleEntity)
            )
            .subscribe((data: TerraformApplyEvent<T>) => {
              console.log('Receive TerraformApplyEvent from Terrform WS', data);
              applySubscription.unsubscribe();
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

              this.applyInProgress = false;
              this.applyStepFinished = true;
              setTimeout(() => {
                this.wizardStepper.next();
              }, 1);
            });
        },
        error => {
          this.applyInProgress = false;
          this.applyStepFinished = false;
        }
      );
  }
  onShowOutputApplied(event) {
    this.planStepFinished = true;
    this.applyStepFinished = true;
    this.showingDirectOutput = true;
    this.varsProvider
      .moduleServiceTerraformState(this.moduleWizard.moduleEntity)
      .subscribe(state => (this.terraformStateOutputs = state.outputs));
    setTimeout(
      () =>
        (this.wizardStepper.selectedIndex =
          2 + (this.shouldSelectArchitecture() ? 1 : 0)),
      1
    );
  }

  shouldSelectArchitecture(): boolean {
    return (
      this.moduleWizard.supportSingleTier ||
      this.moduleWizard.supportMultiTier ||
      this.moduleWizard.supportDocker ||
      this.moduleWizard.supportKubernetes
    );
  }
}

export interface TerraformModuleWizardVarsProvider<T> {
  submitApplyPlan: (moduleEntity: T) => void;
  moduleServicePlan: (moduleEntity: T) => Observable<any>;
  moduleServiceApplyPlan: (
    moduleEntity: T,
    terraformPlanEvent: TerraformPlanEvent<T>
  ) => Observable<any>;
  moduleServiceTerraformState: (moduleEntity: T) => Observable<any>;
  terraformWebsocketEventId: (moduleEntity: T) => string;
}
