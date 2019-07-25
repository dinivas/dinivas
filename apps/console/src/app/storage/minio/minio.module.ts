import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonUiModule } from '@dinivas/common-ui';
import { SharedModule } from './../../shared/shared.module';
import { CoreModule } from './../../core/core.module';

import { MinioRoutingModule } from './minio-routing.module';
import { MinioComponent } from './minio.component';

@NgModule({
  declarations: [MinioComponent],
  imports: [
    CommonModule,
    MinioRoutingModule,
    CommonUiModule,
    SharedModule,
    CoreModule,
  ]
})
export class MinioModule { }
