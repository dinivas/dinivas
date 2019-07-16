import { SharedModule } from './../../shared/shared.module';
import { CoreModule } from './../../core/core.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DroneciRoutingModule } from './droneci-routing.module';
import { DroneciComponent } from './droneci.component';
import { CommonUiModule } from '@dinivas/common-ui';

@NgModule({
  declarations: [DroneciComponent],
  imports: [
    CommonModule,
    CommonUiModule,
    SharedModule,
    CoreModule,
    DroneciRoutingModule
  ]
})
export class DroneciModule { }
