import {
  Component,
  OnInit,
  Input,
  forwardRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { ICloudApiImage } from '@dinivas/dto';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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
    }
  ]
})
export class CloudImageRadiosComponent implements OnInit, ControlValueAccessor {
  @Input()
  label: string;
  @Input()
  cloudImages: ICloudApiImage[];

  imageName: string;
  disabled = false;

  private onTouch: Function;
  private onModelChange: Function;

  constructor() {}

  ngOnInit() {}

  select(cloudImage: ICloudApiImage) {
    this.imageName = cloudImage.name;
    this.onModelChange(cloudImage.name);
    this.onTouch();
  }

  writeValue(imageName: string): void {
    this.imageName = imageName;
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
