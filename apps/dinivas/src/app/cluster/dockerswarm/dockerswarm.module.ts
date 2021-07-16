import { SharedModule } from './../../shared/shared.module';
import { CoreModule } from './../../core/core.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DockerswarmRoutingModule } from './dockerswarm-routing.module';
import { DockerswarmComponent } from './dockerswarm.component';
import { CommonUiModule } from '@dinivas/common-ui';

@NgModule({
  declarations: [DockerswarmComponent],
  imports: [
    CommonModule,
    CommonUiModule,
    SharedModule,
    CoreModule,
    DockerswarmRoutingModule
  ]
})
export class DockerswarmModule { }
