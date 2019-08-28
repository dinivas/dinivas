import { TerraformModuleWizardVarsDirective } from './terraform-module-wizard-vars.directive';
import { ActivatedRoute } from '@angular/router';
import { TerraformWebSocket } from '../terraform-websocket.service';
import {
  Component,
  OnInit,
  ViewChild,
  ComponentFactoryResolver
} from '@angular/core';
import { MatVerticalStepper } from '@angular/material';
import {
  TerraformApplyEvent,
  TerraformPlanEvent,
  ICloudApiImage,
  ICloudApiFlavor
} from '@dinivas/dto';
import { Observable } from 'rxjs';

@Component({
  selector: 'dinivas-terraform-module-wizard',
  templateUrl: './terraform-module-wizard.component.html',
  styleUrls: ['./terraform-module-wizard.component.scss']
})
export class TerraformModuleWizardComponent<T> implements OnInit {
  backButtonRouterLink: string[];
  moduleEntity: T; // ProjectDTO/JenkinsDTO
  moduleEntityName: string; // Ex: project/jenkins
  moduleLabel: string; // name or id in embeded form. The child component should emit this

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
  cloudImages: ICloudApiImage[];
  cloudFlavors: ICloudApiFlavor[];

  @ViewChild(TerraformModuleWizardVarsDirective, { static: true })
  terraformModuleWizardVarsDirective: TerraformModuleWizardVarsDirective;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private readonly terraformWebSocket: TerraformWebSocket,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
        data.component
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
      this.backButtonRouterLink = data.backButtonRouterLink;
      this.moduleEntity = data.moduleEntity;
      this.moduleEntityName = data.moduleEntityName;
      this.moduleLabel = data.moduleLabel;
    });
  }

  submitApplyPlan: (moduleEntity: T) => void;
  moduleServicePlan: (moduleEntity: T) => Observable<any>;
  moduleServiceApplyPlan: (
    moduleEntity: T,
    terraformPlanEvent: TerraformPlanEvent<T>
  ) => Observable<any>;
  moduleServiceTerraformState: (moduleEntity: T) => Observable<any>;
  terraformWebsocketEventId: (moduleEntity: T) => string;

  onPlanApplied($event) {
    console.log($event);
  }

  onApplyApplied($event) {
    console.log($event);
  }

  planProject(moduleEntity: T) {
    this.moduleServicePlan(moduleEntity).subscribe(
      () => {
        this.terraformWebSocket
          .receivePlanEvent(this.terraformWebsocketEventId(moduleEntity))
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
    this.moduleServiceApplyPlan(
      moduleEntity,
      this.terraformPlanEvent
    ).subscribe(
      () => {
        this.terraformWebSocket
          .receiveApplyEvent(this.terraformWebsocketEventId(moduleEntity))
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
    this.moduleServiceTerraformState(this.moduleEntity).subscribe(
      state => (this.terraformStateOutputs = state.outputs)
    );
    setTimeout(() => (this.wizardStepper.selectedIndex = 2), 1);
  }
}
