import { CommonUiModule } from '@dinivas/common-ui';
import { SharedModule } from './../shared/shared.module';
import { CoreModule } from './../core/core.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClusterRoutingModule } from './cluster-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CommonUiModule,
    SharedModule,
    CoreModule,
    ClusterRoutingModule
  ]
})
export class ClusterModule { }
