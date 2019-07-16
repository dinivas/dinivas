import { SharedModule } from './../../shared/shared.module';
import { CoreModule } from './../../core/core.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OpenshiftRoutingModule } from './openshift-routing.module';
import { OpenshiftComponent } from './openshift.component';
import { CommonUiModule } from '@dinivas/common-ui';

@NgModule({
  declarations: [OpenshiftComponent],
  imports: [
    CommonModule,
    CommonUiModule,
    SharedModule,
    CoreModule,
    OpenshiftRoutingModule
  ]
})
export class OpenshiftModule { }
