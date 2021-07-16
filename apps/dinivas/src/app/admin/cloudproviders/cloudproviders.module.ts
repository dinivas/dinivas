import { CoreModule } from '../../core/core.module';
import { CommonUiModule } from '@dinivas/common-ui';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CloudproviderRoutingModule } from './cloudproviders-routing.module';
import { CloudprovidersComponent } from './cloudproviders.component';
import { SharedModule } from '../../shared/shared.module';
import { CloudproviderEditComponent } from './cloudprovider-edit/cloudprovider-edit.component';

@NgModule({
  declarations: [CloudprovidersComponent, CloudproviderEditComponent],
  imports: [
    CommonModule,
    CommonUiModule,
    SharedModule,
    CoreModule,
    CloudproviderRoutingModule
  ],
  entryComponents: []
})
export class CloudprovidersModule {}
