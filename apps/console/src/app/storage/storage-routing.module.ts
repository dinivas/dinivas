import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: 'postgresql', loadChildren: () => import('./postgresql/postgresql.module').then(m => m.PostgresqlModule)},
  {path: 'redis', loadChildren: () => import('./redis/redis.module').then(m => m.RedisModule)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StorageRoutingModule { }
