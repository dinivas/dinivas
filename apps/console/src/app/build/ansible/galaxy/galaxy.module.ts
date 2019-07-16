import { SharedModule } from './../../../shared/shared.module';
import { CoreModule } from './../../../core/core.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GalaxyRoutingModule } from './galaxy-routing.module';
import { GalaxyComponent } from './galaxy.component';
import { CommonUiModule } from '@dinivas/common-ui';

@NgModule({
  declarations: [GalaxyComponent],
  imports: [
    CommonModule,
    CommonUiModule,
    SharedModule,
    CoreModule,
    GalaxyRoutingModule
  ]
})
export class GalaxyModule { }
