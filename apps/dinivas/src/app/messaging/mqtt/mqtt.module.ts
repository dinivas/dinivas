import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../../shared/shared.module';
import { CoreModule } from './../../core/core.module';
import { CommonUiModule } from '@dinivas/common-ui';

import { MqttRoutingModule } from './mqtt-routing.module';
import { MqttComponent } from './mqtt.component';

@NgModule({
  declarations: [MqttComponent],
  imports: [
    CommonModule,
    CommonUiModule,
    SharedModule,
    CoreModule,
    MqttRoutingModule
  ]
})
export class MqttModule { }
