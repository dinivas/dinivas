import {
  Component,
  OnInit,
  Input,
  forwardRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { ICloudApiImage } from '@dinivas/dto';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  Validator,
  AbstractControl,
  ValidationErrors,
  NG_VALIDATORS
} from '@angular/forms';

@Component({
  selector: 'dinivas-cloud-image-radios',
  templateUrl: './cloud-image-radios.component.html',
  styleUrls: ['./cloud-image-radios.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CloudImageRadiosComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: CloudImageRadiosComponent,
      multi: true
    }
  ]
})
export class CloudImageRadiosComponent
  implements OnInit, ControlValueAccessor, Validator {
  @Input()
  label: string;
  @Input()
  cloudImages: ICloudApiImage[];

  image: ICloudApiImage;
  disabled = false;

  private onTouch: Function;
  private onModelChange: Function;
  private onValidatorChange: Function;

  constructor() {}

  ngOnInit() {}

  select(cloudImage: ICloudApiImage) {
    this.image = cloudImage;
    this.onModelChange(cloudImage);
    this.onTouch();
  }

  writeValue(imageName: string): void {
    this.image = this.cloudImages
      ? this.cloudImages.find(img => img.name === imageName)
      : null;
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
  validate(control: AbstractControl): ValidationErrors {
    return this.image ? null : { required: true };
  }
  registerOnValidatorChange?(fn: () => void): void {
    this.onValidatorChange = fn;
  }
}
