import { CommonUiModule } from '@dinivas/common-ui';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CloudproviderRoutingModule } from './cloudprovider-routing.module';
import { CloudproviderListComponent } from './cloudprovider-list/cloudprovider-list.component';
import { MatTableModule, MatPaginatorModule, MatSortModule } from '@angular/material';
import { CloudproviderDialogComponent } from './cloudprovider-dialog/cloudprovider-dialog.component';

@NgModule({
  declarations: [CloudproviderListComponent, CloudproviderDialogComponent],
  imports: [
    CommonModule,
    CommonUiModule,
    CloudproviderRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  entryComponents: [CloudproviderDialogComponent]
})
export class CloudproviderModule { }
