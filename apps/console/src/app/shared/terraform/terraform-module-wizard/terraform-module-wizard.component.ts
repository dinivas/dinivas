import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { TerraformModuleWizardVarsDirective } from './terraform-module-wizard-vars.directive';
import { ActivatedRoute } from '@angular/router';
import { TerraformWebSocket } from '../terraform-websocket.service';
import {
  Component,
  OnInit,
  ViewChild,
  ComponentFactoryResolver,
  ElementRef
} from '@angular/core';
import { MatVerticalStepper } from '@angular/material';
import {
  TerraformApplyEvent,
  TerraformPlanEvent,
  ICloudApiImage,
  ICloudApiFlavor
} from '@dinivas/dto';
import { Observable } from 'rxjs';
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
  @ViewChild(MatVerticalStepper, { static: false })
  wizardStepper: MatVerticalStepper;
  isLinear = true;

  terraformPlanEvent: TerraformPlanEvent<T>;
  terraformApplyEvent: TerraformApplyEvent<T>;
  terraformStateOutputs: any[];
  shouldShowSensitiveData: any = {};
  showingDirectOutput = false;
  architectureTypes: { code: string; label: string }[] = [];
  cloudImages: ICloudApiImage[];
  cloudFlavors: ICloudApiFlavor[];
  architectureType: string;
  architectureTypeForm: FormGroup;

  @ViewChild(TerraformModuleWizardVarsDirective, { static: true })
  terraformModuleWizardVarsDirective: TerraformModuleWizardVarsDirective;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private readonly terraformWebSocket: TerraformWebSocket,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => {
      this.moduleWizard = data.moduleWizard;
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
      )).applyApplied = this.terraformModuleWizardVarsDirective.applyApplied;
      (<any>(
        componentRef.instance
      )).onArchitectureTypeChanged = this.terraformModuleWizardVarsDirective.onArchitectureTypeChanged;

      this.varsProvider = <any>componentRef.instance;
      this.initArchitectureTypeSelection();
    });
  }
  initArchitectureTypeSelection() {
    if (this.shouldSelectArchitecture()) {
      if (this.moduleWizard.supportSingleTier) {
        this.architectureTypes.push({
          code: 'singletier',
          label: 'Single-Tier'
        });
      }
      if (this.moduleWizard.supportMultiTier) {
        this.architectureTypes.push({ code: 'multitier', label: 'Multi-Tier' });
      }
      if (this.moduleWizard.supportDocker) {
        this.architectureTypes.push({
          code: 'docker',
          label: 'Docker Container'
        });
      }
      if (this.moduleWizard.supportKubernetes) {
        this.architectureTypes.push({
          code: 'kubernetes',
          label: 'Kubernetes'
        });
      }
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
    }
  }
  onSelectArchitectureType($event, architectureTypeForm: NgForm) {}
  onPlanApplied($event) {
    this.planInProgress = true;
    this.planStepFinished = false;
    this.planModule($event);
  }

  onApplyApplied($event) {
    console.log($event);
  }

  planModule(moduleEntity: T) {
    this.varsProvider.moduleServicePlan(moduleEntity).subscribe(
      () => {
        this.terraformWebSocket
          .receivePlanEvent(
            this.varsProvider.terraformWebsocketEventId(moduleEntity)
          )
          .subscribe((data: TerraformPlanEvent<T>) => {
            console.log('Receive TerraformPlanEvent from Terrform WS', data);
            this.terraformPlanEvent = data;
            this.planInProgress = false;
            this.planStepFinished = true;
            setTimeout(() => {
              this.wizardStepper.next();
            }, 1);
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
          this.terraformWebSocket
            .receiveApplyEvent(
              this.varsProvider.terraformWebsocketEventId(moduleEntity)
            )
            .subscribe((data: TerraformApplyEvent<T>) => {
              console.log('Receive TerraformApplyEvent from Terrform WS', data);
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
  showProjectOutput() {
    this.planStepFinished = true;
    this.applyStepFinished = true;
    this.showingDirectOutput = true;
    this.varsProvider
      .moduleServiceTerraformState(this.moduleWizard.moduleEntity)
      .subscribe(state => (this.terraformStateOutputs = state.outputs));
    setTimeout(() => (this.wizardStepper.selectedIndex = 2), 1);
  }

  shouldSelectArchitecture(): boolean {
    return (
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
