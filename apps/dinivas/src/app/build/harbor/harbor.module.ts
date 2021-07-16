import { CoreModule } from './../../core/core.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HarborRoutingModule } from './harbor-routing.module';
import { HarborComponent } from './harbor.component';
import { CommonUiModule } from '@dinivas/common-ui';

@NgModule({
  declarations: [HarborComponent],
  imports: [
    CommonModule,
    CommonUiModule,
    SharedModule,
    CoreModule,
    HarborRoutingModule
  ]
})
export class HarborModule {}
