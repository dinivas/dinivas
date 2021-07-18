import { MandatorySelectedProjectGuard } from './../core/guards/mandatory-selected-project/mandatory-selected-project.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'rabbitmq',
    loadChildren: () =>
      import('./rabbitmq/rabbitmq.module').then((m) => m.RabbitmqModule),
    canActivate: [MandatorySelectedProjectGuard],
  },
  {
    path: 'kafka',
    loadChildren: () =>
      import('./kafka/kafka.module').then((m) => m.KafkaModule),
    canActivate: [MandatorySelectedProjectGuard],
  },
  {
    path: 'mqtt',
    loadChildren: () => import('./mqtt/mqtt.module').then((m) => m.MqttModule),
    canActivate: [MandatorySelectedProjectGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MessagingRoutingModule {}
