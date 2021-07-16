import { ConsulViewComponent } from './consul-view.component';
import { CommonUiModule } from '@dinivas/common-ui';
import { SharedModule } from './../../shared/shared.module';
import { CoreModule } from './../../core/core.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsulRoutingModule } from './consul-routing.module';
import { ConsulComponent } from './consul.component';
import { ConsulWizardComponent } from './consul-wizard/consul-wizard.component';
import { ConsulStatusComponent } from './consul-status/consul-status.component';

@NgModule({
  declarations: [ConsulComponent, ConsulWizardComponent, ConsulViewComponent, ConsulStatusComponent],
  imports: [
    CommonModule,
    CommonUiModule,
    SharedModule,
    CoreModule,
    ConsulRoutingModule
  ],
  entryComponents: [ConsulWizardComponent]
})
export class ConsulModule { }
