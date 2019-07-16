import { SharedModule } from './../../shared/shared.module';
import { CoreModule } from './../../core/core.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RedisRoutingModule } from './redis-routing.module';
import { RedisComponent } from './redis.component';
import { CommonUiModule } from '@dinivas/common-ui';

@NgModule({
  declarations: [RedisComponent],
  imports: [
    CommonModule,
    CommonUiModule,
    SharedModule,
    CoreModule,
    RedisRoutingModule
  ]
})
export class RedisModule { }
