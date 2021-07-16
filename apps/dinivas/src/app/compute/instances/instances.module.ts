import { InstanceViewComponent } from './instance-view.component';
import { CommonUiModule } from '@dinivas/common-ui';
import { SharedModule } from './../../shared/shared.module';
import { CoreModule } from './../../core/core.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstancesRoutingModule } from './instances-routing.module';
import { InstancesComponent } from './instances.component';
import { InstanceWizardComponent } from './instance-wizard/instance-wizard.component';
import { InstanceStatusComponent } from './instance-status/instance-status.component';

@NgModule({
  declarations: [
    InstancesComponent,
    InstanceWizardComponent,
    InstanceStatusComponent,
    InstanceViewComponent
  ],
  imports: [
    CommonModule,
    CommonUiModule,
    SharedModule,
    CoreModule,
    InstancesRoutingModule
  ],
  entryComponents: [InstanceWizardComponent]
})
export class InstancesModule {}
