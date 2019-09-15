import {
  Directive,
  ViewContainerRef,
  Output,
  EventEmitter
} from '@angular/core';

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

  constructor(public viewContainerRef: ViewContainerRef) {}
}
