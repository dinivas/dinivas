import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RedisComponent } from './redis.component';

const routes: Routes = [
  { path: '', component: RedisComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RedisRoutingModule { }
