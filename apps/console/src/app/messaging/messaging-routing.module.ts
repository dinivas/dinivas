import { MandatorySelectedProjectGuard } from './../core/guards/mandatory-selected-project/mandatory-selected-project.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'rabbitmq',
    loadChildren: './rabbitmq/rabbitmq.module#RabbitmqModule',
    canActivate: [MandatorySelectedProjectGuard]
  },
  {
    path: 'kafka',
    loadChildren: './kafka/kafka.module#KafkaModule',
    canActivate: [MandatorySelectedProjectGuard]
  },
  {
    path: 'mqtt',
    loadChildren: './mqtt/mqtt.module#MqttModule',
    canActivate: [MandatorySelectedProjectGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessagingRoutingModule {}
