import { CommonUiModule } from '@dinivas/common-ui';
import { SharedModule } from './../../shared/shared.module';
import { CoreModule } from './../../core/core.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RadiusRoutingModule } from './radius-routing.module';
import { RadiusComponent } from './radius.component';

@NgModule({
  declarations: [RadiusComponent],
  imports: [
    CommonModule,
    CommonUiModule,
    SharedModule,
    CoreModule,
    RadiusRoutingModule
  ]
})
export class RadiusModule {}
