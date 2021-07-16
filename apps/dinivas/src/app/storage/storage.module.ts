import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StorageRoutingModule } from './storage-routing.module';
import { MongodbModule } from './mongodb/mongodb.module';
import { ElasticsearchModule } from './elasticsearch/elasticsearch.module';
import { MinioModule } from './minio/minio.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StorageRoutingModule,
    MongodbModule,
    ElasticsearchModule,
    MinioModule
  ]
})
export class StorageModule { }
