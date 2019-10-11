import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../../shared/shared.module';
import { CoreModule } from './../../core/core.module';
import { CommonUiModule } from '@dinivas/common-ui';

import { RabbitmqRoutingModule } from './rabbitmq-routing.module';
import { RabbitmqComponent } from './rabbitmq.component';
import { RabbitmqStatusComponent } from './rabbitmq-status/rabbitmq-status.component';
import { RabbitmqWizardComponent } from './rabbitmq-wizard/rabbitmq-wizard.component';
import { RabbitMQViewComponent } from './rabbitmq-view.component';

@NgModule({
  declarations: [
    RabbitmqComponent,
    RabbitmqStatusComponent,
    RabbitmqWizardComponent,
    RabbitMQViewComponent
  ],
  imports: [
    CommonModule,
    CommonUiModule,
    SharedModule,
    CoreModule,
    RabbitmqRoutingModule
  ],
  entryComponents: [RabbitmqWizardComponent]
})
export class RabbitmqModule {}
