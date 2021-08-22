import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  forwardRef,
} from '@angular/core';
import { ICloudApiKeyPair } from '@dinivas/api-interfaces';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  Validator,
  ValidationErrors,
  AbstractControl,
  NG_VALIDATORS,
} from '@angular/forms';

@Component({
  selector: 'dinivas-cloud-keypair-radios',
  templateUrl: './cloud-keypair-radios.component.html',
  styleUrls: ['./cloud-keypair-radios.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CloudKeyPairRadiosComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: CloudKeyPairRadiosComponent,
      multi: true,
    },
  ],
})
export class CloudKeyPairRadiosComponent
  implements OnInit, ControlValueAccessor, Validator
{
  @Input()
  label: string;
  @Input()
  cloudKeyPairs: ICloudApiKeyPair[];

  cloudKeyPair: ICloudApiKeyPair;
  disabled = false;

  private onTouch: () => void;
  private onModelChange: (cloudKeyPair: ICloudApiKeyPair) => void;
  private onValidatorChange: () => void;

  constructor() {}

  ngOnInit() {}

  select(keyPair: ICloudApiKeyPair) {
    this.cloudKeyPair = keyPair;
    this.onModelChange(keyPair);
    this.onTouch();
  }

  writeValue(keyPairName: string): void {
    this.cloudKeyPair = this.cloudKeyPairs
      ? this.cloudKeyPairs.find((keyPair) => keyPair.name === keyPairName)
      : null;
  }
  registerOnChange(fn: any): void {
    this.onModelChange = fn;
    this.onModelChange(this.cloudKeyPair);
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  validate(control: AbstractControl): ValidationErrors {
    return this.cloudKeyPair ? null : { required: true };
  }
  registerOnValidatorChange?(fn: () => void): void {
    this.onValidatorChange = fn;
  }
}
