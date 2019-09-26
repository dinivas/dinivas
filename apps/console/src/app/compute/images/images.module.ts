import { CoreModule } from './../../core/core.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImagesRoutingModule } from './images-routing.module';
import {
  ImagesComponent,
  ImageToBuildDialogComponent
} from './images.component';
import { CommonUiModule } from '@dinivas/common-ui';

@NgModule({
  declarations: [ImagesComponent, ImageToBuildDialogComponent],
  imports: [
    CommonModule,
    CommonUiModule,
    SharedModule,
    CoreModule,
    ImagesRoutingModule
  ],
  entryComponents: [ImageToBuildDialogComponent]
})
export class ImagesModule {}
