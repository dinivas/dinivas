import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../../shared/shared.module';
import { CoreModule } from './../../core/core.module';
import { CommonUiModule } from '@dinivas/common-ui';

import { KafkaRoutingModule } from './kafka-routing.module';
import { KafkaComponent } from './kafka.component';

@NgModule({
  declarations: [KafkaComponent],
  imports: [
    CommonModule,
    CommonUiModule,
    SharedModule,
    CoreModule,
    KafkaRoutingModule
  ]
})
export class KafkaModule { }
