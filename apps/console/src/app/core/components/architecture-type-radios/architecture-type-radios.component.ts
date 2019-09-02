import {
  Component,
  OnInit,
  Input,
  forwardRef,
  ChangeDetectionStrategy,
  EventEmitter,
  Output
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'dinivas-architecture-type-radios',
  templateUrl: './architecture-type-radios.component.html',
  styleUrls: ['./architecture-type-radios.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ArchitectureTypeRadiosComponent),
      multi: true
    }
  ]
})
export class ArchitectureTypeRadiosComponent
  implements OnInit, ControlValueAccessor {
  @Input()
  label: string;
  @Input()
  architectureTypes: { code: string; label: string }[];
  @Output()
  onSelect: EventEmitter<any> = new EventEmitter();

  architectureType: string;
  disabled = false;

  private onTouch: Function;
  private onModelChange: Function;

  constructor() {}

  ngOnInit() {}

  select(architectureType: { code: string; label: string }) {
    this.architectureType = architectureType.code;
    this.onModelChange(architectureType.code);
    this.onTouch();
    this.onSelect.emit(architectureType.code);
  }

  writeValue(architectureType: string): void {
    this.architectureType = architectureType;
  }
  registerOnChange(fn: any): void {
    this.onModelChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
