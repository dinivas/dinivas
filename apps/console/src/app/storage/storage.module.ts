import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StorageRoutingModule } from './storage-routing.module';
import { MongodbModule } from './mongodb/mongodb.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StorageRoutingModule,
    MongodbModule
  ]
})
export class StorageModule { }
