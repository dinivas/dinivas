import { SharedModule } from './../../../shared/shared.module';
import { CoreModule } from './../../../core/core.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoryRoutingModule } from './history-routing.module';
import { HistoryComponent } from './history.component';
import { CommonUiModule } from '@dinivas/common-ui';

@NgModule({
  declarations: [HistoryComponent],
  imports: [
    CommonModule,
    CommonUiModule,
    SharedModule,
    CoreModule,
    HistoryRoutingModule
  ]
})
export class HistoryModule { }
