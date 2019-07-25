import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: 'postgresql', loadChildren: './postgresql/postgresql.module#PostgresqlModule'},
  {path: 'mongodb', loadChildren: './mongodb/mongodb.module#MongodbModule'},
  {path: 'redis', loadChildren: './redis/redis.module#RedisModule'},
  {path: 'elasticsearch', loadChildren: './elasticsearch/elasticsearch.module#ElasticsearchModule'},
  {path: 'minio', loadChildren: './minio/minio.module#MinioModule'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StorageRoutingModule { }
