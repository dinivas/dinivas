import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CloudproviderRoutingModule } from './cloudprovider-routing.module';
import { ListComponent } from './list/list.component';

@NgModule({
  declarations: [ListComponent],
  imports: [
    CommonModule,
    CloudproviderRoutingModule
  ]
})
export class CloudproviderModule { }
