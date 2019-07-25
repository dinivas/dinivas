import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessagingRoutingModule } from './messaging-routing.module';
import { MqttModule } from './mqtt/mqtt.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MessagingRoutingModule,
    MqttModule
  ]
})
export class MessagingModule { }
