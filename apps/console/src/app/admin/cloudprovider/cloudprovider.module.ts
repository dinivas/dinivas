import { CoreModule } from './../../core/core.module';
import { CommonUiModule } from '@dinivas/common-ui';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CloudproviderRoutingModule } from './cloudprovider-routing.module';
import { CloudproviderListComponent } from './cloudprovider-list/cloudprovider-list.component';
import { CloudproviderDialogComponent } from './cloudprovider-dialog/cloudprovider-dialog.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [CloudproviderListComponent, CloudproviderDialogComponent],
  imports: [
    CommonModule,
    CommonUiModule,
    SharedModule,
    CoreModule,
    CloudproviderRoutingModule
  ],
  entryComponents: [CloudproviderDialogComponent]
})
export class CloudproviderModule { }
