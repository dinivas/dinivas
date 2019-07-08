import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: 'postgresql', loadChildren: './postgresql/postgresql.module#PostgresqlModule'},
  {path: 'redis', loadChildren: './redis/redis.module#RedisModule'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StorageRoutingModule { }
