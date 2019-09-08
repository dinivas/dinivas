import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuildRoutingModule } from './build-routing.module';
import { HarborModule } from './harbor/harbor.module';
import { NexusModule } from './nexus/nexus.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BuildRoutingModule,
    HarborModule,
    NexusModule
  ]
})
export class BuildModule { }
