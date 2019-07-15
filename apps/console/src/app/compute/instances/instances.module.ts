import { CommonUiModule } from '@dinivas/common-ui';
import { SharedModule } from './../../shared/shared.module';
import { CoreModule } from './../../core/core.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstancesRoutingModule } from './instances-routing.module';
import { InstancesComponent } from './instances.component';

@NgModule({
  declarations: [InstancesComponent],
  imports: [
    CommonModule,
    CommonUiModule,
    SharedModule,
    CoreModule,
    InstancesRoutingModule
  ]
})
export class InstancesModule { }
