import { SharedModule } from './../../shared/shared.module';
import { CoreModule } from './../../core/core.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MongodbRoutingModule } from './mongodb-routing.module';
import { MongodbComponent } from './mongodb.component';
import { CommonUiModule } from '@dinivas/common-ui';

@NgModule({
  declarations: [MongodbComponent],
  imports: [
    CommonModule,
    CommonUiModule,
    SharedModule,
    CoreModule,
    MongodbRoutingModule
  ]
})
export class MongodbModule { }
