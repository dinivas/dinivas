import { CloudproviderListComponent } from './cloudprovider-list/cloudprovider-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'list', component: CloudproviderListComponent },
  { path: '',   redirectTo: 'list' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CloudproviderRoutingModule { }
