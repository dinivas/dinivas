import { AlertService } from './../../../core/alert/alert.service';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { TerraformModuleWizardVarsDirective } from './terraform-module-wizard-vars.directive';
import { ActivatedRoute } from '@angular/router';
import { SharedWebSocket } from '../../shared-websocket.service';
import {
  Component,
  OnInit,
  ViewChild,
  ComponentFactoryResolver,
  ComponentRef,
} from '@angular/core';
import { MatVerticalStepper } from '@angular/material/stepper';
import {
  TerraformModuleEvent,
  ICloudApiImage,
  ICloudApiFlavor,
} from '@dinivas/api-interfaces';
import { Observable, Subject } from 'rxjs';
import {
  TerraformModuleType,
  TerraformModuleWizard,
} from './terraform-module-wizard';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

@Component({
  selector: 'dinivas-terraform-module-wizard',
  templateUrl: './terraform-module-wizard.component.html',
  styleUrls: ['./terraform-module-wizard.component.scss'],
})
export class TerraformModuleWizardComponent<T extends TerraformModuleType>
  implements OnInit
{
  // Variables that contains all input datas
  moduleWizard!: TerraformModuleWizard<T>;

  varsProvider!: TerraformModuleWizardVarsProvider<T>;

  planStepFinished = false;
  applyStepFinished = false;
  planInProgress = false;
  applyInProgress = false;
  wizardStepper!: MatVerticalStepper;
  _wizardStepper = new Subject<MatVerticalStepper>();
  @ViewChild(MatVerticalStepper)
  set _wizardStepperRef(stepper: MatVerticalStepper) {
    this.wizardStepper = stepper;
    this._wizardStepper.next(this.wizardStepper);
  }

  isLinear = true;

  planSpinnerMode: ProgressSpinnerMode = 'indeterminate';
  applySpinnerMode: ProgressSpinnerMode = 'indeterminate';
  planSpinnerValue = 0;
  applySpinnerValue = 0;

  terraformPlanEvent!: TerraformModuleEvent<T>;
  terraformApplyEvent!: TerraformModuleEvent<T>;
  terraformStateOutputs!: any[];
  shouldShowSensitiveData: any = {};
  showingDirectOutput = false;
  architectureTypes: {
    code: string;
    label: string;
    disabled: boolean;
    description: string;
  }[] = [];
  cloudImages!: ICloudApiImage[];
  cloudFlavors!: ICloudApiFlavor[];
  architectureType!: string;
  architectureTypeForm!: FormGroup;

  @ViewChild(TerraformModuleWizardVarsDirective, { static: true })
  terraformModuleWizardVarsDirective!: TerraformModuleWizardVarsDirective;

  childConponentRef!: ComponentRef<any>;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private readonly sharedWebSocket: SharedWebSocket,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe((data) => {
      this.moduleWizard = data.moduleWizard;
      this.moduleWizard.moduleEntity = data.moduleEntity
        ? data.moduleEntity.entity
        : undefined;
      const componentFactory =
        this.componentFactoryResolver.resolveComponentFactory(
          this.moduleWizard.component
        );

      const viewContainerRef =
        this.terraformModuleWizardVarsDirective.viewContainerRef;
      viewContainerRef.clear();

      const componentRef = viewContainerRef.createComponent(componentFactory);
      (<any>componentRef.instance).planApplied =
        this.terraformModuleWizardVarsDirective.planApplied;
      (<any>componentRef.instance).showOutputApplied =
        this.terraformModuleWizardVarsDirective.showOutputApplied;
      (<any>componentRef.instance).applyApplied =
        this.terraformModuleWizardVarsDirective.applyApplied;
      (<any>componentRef.instance).onArchitectureTypeChanged =
        this.terraformModuleWizardVarsDirective.onArchitectureTypeChanged;
      this.childConponentRef = componentRef;
      (<any>this.childConponentRef.instance).moduleWizardStepper =
        this._wizardStepper.asObservable();
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
        description: 'Simple architecture based on only one instance, NO HA',
      });
      this.architectureTypes.push({
        code: 'multitier',
        label: 'Multi-Tier',
        disabled: !this.moduleWizard.supportMultiTier,
        description:
          'High Availability architecture based on multiple instance with load balancing',
      });
      this.architectureTypes.push({
        code: 'docker',
        label: 'Docker Container',
        disabled: !this.moduleWizard.supportDocker,
        description: 'Deploy a docker container on one Instance',
      });
      this.architectureTypes.push({
        code: 'kubernetes',
        label: 'Kubernetes',
        disabled: !this.moduleWizard.supportKubernetes,
        description: 'Deploy on existing Kubernetes cluster using Helm chart',
      });
      this.architectureTypeForm = this.formBuilder.group({
        architecture_type: [
          this.architectureType ? this.architectureType : null,
          Validators.required,
        ],
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
  onSelectArchitectureType($event, architectureTypeForm?: NgForm) {}

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
    this.planSpinnerMode = 'indeterminate';
    this.planSpinnerValue = 0;
    this.varsProvider.moduleServicePlan(moduleEntity).subscribe(
      (res) => {
        const planJobProgressEventSuSubscription = this.sharedWebSocket
          .receiveBackgroundJobProgressEventForGivenJobId(res.planJobId)
          .subscribe((res) => {
            this.planSpinnerValue = res.progress;
          });
        const planEventSuSubscription = this.sharedWebSocket
          .receivePlanEvent<TerraformModuleEvent<T>>(
            this.varsProvider.terraformWebsocketEventId(moduleEntity)
          )
          .subscribe((data: TerraformModuleEvent<T>) => {
            console.log('Receive TerraformPlanEvent from Terrform WS', data);
            planEventSuSubscription.unsubscribe();
            this.terraformPlanEvent = data;
            this.planInProgress = false;
            this.planStepFinished = true;
            planJobProgressEventSuSubscription.unsubscribe();
            setTimeout(() => {
              this.wizardStepper.next();
            }, 1);
          });

        this.sharedWebSocket
          .receivePlanErrorEvent<string>(
            this.varsProvider.terraformWebsocketEventId(moduleEntity)
          )
          .subscribe((error: string) => {
            this.alertService.error(error);
            this.planInProgress = false;
            this.planStepFinished = false;
            planJobProgressEventSuSubscription.unsubscribe();
          });
        const planJobErrorEventSuSubscription = this.sharedWebSocket
          .receiveBackgroundJobFailedEventForGivenJobId(res.planJobId)
          .subscribe((err) => {
            planJobErrorEventSuSubscription.unsubscribe();
            this.alertService.error(err.error);
            this.planInProgress = false;
            this.planStepFinished = false;
            planJobProgressEventSuSubscription.unsubscribe();
          });
      },
      (error) => {
        this.planInProgress = false;
        this.planStepFinished = false;
      }
    );
  }

  applyPlan(moduleEntity: T) {
    this.applySpinnerMode = 'indeterminate';
    this.applySpinnerValue = 0;
    this.varsProvider.moduleServiceApplyPlan(moduleEntity).subscribe(
      (res) => {
        const applyJobProgressEventSuSubscription = this.sharedWebSocket
          .receiveBackgroundJobProgressEventForGivenJobId(res.applyJobId)
          .subscribe((res) => {
            this.applySpinnerValue = res.progress;
          });
        const applySubscription = this.sharedWebSocket
          .receiveApplyEvent<TerraformModuleEvent<T>>(
            this.varsProvider.terraformWebsocketEventId(moduleEntity)
          )
          .subscribe((data) => {
            console.log('Receive TerraformApplyEvent from Terrform WS', data);
            applySubscription.unsubscribe();
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

            this.applyInProgress = false;
            this.applyStepFinished = true;
            applyJobProgressEventSuSubscription.unsubscribe();
            setTimeout(() => {
              this.wizardStepper.next();
            }, 1);
          });
        // Error case
        const applyJobErrorEventSuSubscription = this.sharedWebSocket
          .receiveBackgroundJobFailedEventForGivenJobId(res.applyJobId)
          .subscribe((err) => {
            applyJobErrorEventSuSubscription.unsubscribe();
            this.alertService.error(err.error);
            this.applyInProgress = false;
            this.applyStepFinished = false;
            applyJobProgressEventSuSubscription.unsubscribe();
          });
      },
      (error) => {
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
      .subscribe((state) => (this.terraformStateOutputs = state.outputs));
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
  moduleServicePlan: (moduleEntity: T) => Observable<{ planJobId: number }>;
  moduleServiceApplyPlan: (
    moduleEntity: T
  ) => Observable<{ applyJobId: number }>;
  moduleServiceTerraformState: (moduleEntity: T) => Observable<any>;
  terraformWebsocketEventId: (moduleEntity: T) => string;
}
