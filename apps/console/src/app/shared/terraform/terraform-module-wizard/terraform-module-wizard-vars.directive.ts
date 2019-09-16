import { Observable } from 'rxjs/';
import {
  Directive,
  ViewContainerRef,
  Output,
  EventEmitter,
  Input
} from '@angular/core';
import { MatVerticalStepper } from '@angular/material';

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
