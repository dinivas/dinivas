import { SharedModule } from './../../shared/shared.module';
import { CoreModule } from './../../core/core.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DisksRoutingModule } from './disks-routing.module';
import { DisksComponent } from './disks.component';
import { CommonUiModule } from '@dinivas/common-ui';

@NgModule({
  declarations: [DisksComponent],
  imports: [
    CommonModule,
    CommonUiModule,
    SharedModule,
    CoreModule,
    DisksRoutingModule
  ]
})
export class DisksModule { }
