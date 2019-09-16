import { CommonUiModule } from '@dinivas/common-ui';
import { SharedModule } from './../../shared/shared.module';
import { CoreModule } from './../../core/core.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsulRoutingModule } from './consul-routing.module';
import { ConsulComponent } from './consul.component';

@NgModule({
  declarations: [ConsulComponent],
  imports: [
    CommonModule,
    CommonUiModule,
    SharedModule,
    CoreModule,
    ConsulRoutingModule
  ]
})
export class ConsulModule { }
