import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonUiModule } from '@dinivas/common-ui';
import { SharedModule } from './../../shared/shared.module';
import { CoreModule } from './../../core/core.module';

import { ElasticsearchRoutingModule } from './elasticsearch-routing.module';
import { ElasticsearchComponent } from './elasticsearch.component';

@NgModule({
  declarations: [ElasticsearchComponent],
  imports: [
    CommonModule,
    ElasticsearchRoutingModule,
    CommonUiModule,
    SharedModule,
    CoreModule
  ]
})
export class ElasticsearchModule {}
