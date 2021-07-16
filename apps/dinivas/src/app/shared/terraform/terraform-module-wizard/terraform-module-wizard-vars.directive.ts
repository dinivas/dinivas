/* eslint-disable @angular-eslint/no-output-on-prefix */
import { Directive, EventEmitter, Input, Output, ViewContainerRef } from "@angular/core";
import { MatVerticalStepper } from "@angular/material/stepper";
import { Observable } from "rxjs";

@Directive({
  selector: '[dinivasTerraformModuleWizardVars]'
})
export class TerraformModuleWizardVarsDirective {
  @Output()
  onArchitectureTypeChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  planApplied: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  showOutputApplied: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  applyApplied: EventEmitter<any> = new EventEmitter<any>();
  @Input()
  moduleWizardStepper: Observable<MatVerticalStepper>;

  constructor(public viewContainerRef: ViewContainerRef) {}
}
