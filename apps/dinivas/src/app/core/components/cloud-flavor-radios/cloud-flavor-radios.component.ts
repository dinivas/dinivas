import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  forwardRef,
  Output
} from '@angular/core';
import { ICloudApiFlavor } from '@dinivas/api-interfaces';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  Validator,
  ValidationErrors,
  AbstractControl,
  NG_VALIDATORS
} from '@angular/forms';

@Component({
  selector: 'dinivas-cloud-flavor-radios',
  templateUrl: './cloud-flavor-radios.component.html',
  styleUrls: ['./cloud-flavor-radios.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CloudFlavorRadiosComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: CloudFlavorRadiosComponent,
      multi: true
    }
  ]
})
export class CloudFlavorRadiosComponent
  implements OnInit, ControlValueAccessor, Validator {
  @Input()
  label: string;
  @Input()
  cloudFlavors: ICloudApiFlavor[];

  cloudFlavor: ICloudApiFlavor;
  disabled = false;

  private onTouch: () => void;
  private onModelChange: (flavor: ICloudApiFlavor) => void;
  private onValidatorChange: () => void;

  constructor() {}

  ngOnInit() {}

  select(flavor: ICloudApiFlavor) {
    this.cloudFlavor = flavor;
    this.onModelChange(flavor);
    this.onTouch();
  }

  writeValue(flavorName: string): void {
    this.cloudFlavor = this.cloudFlavors
      ? this.cloudFlavors.find(flavor => flavor.name === flavorName)
      : null;
  }
  registerOnChange(fn: any): void {
    this.onModelChange = fn;
    this.onModelChange(this.cloudFlavor);
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  validate(control: AbstractControl): ValidationErrors {
    return this.cloudFlavor ? null : { required: true };
  }
  registerOnValidatorChange?(fn: () => void): void {
    this.onValidatorChange = fn;
  }
}
