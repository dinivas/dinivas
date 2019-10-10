import { Module } from '@nestjs/common';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [RabbitmqModule, KafkaModule]
})
export class MessagingModule {}
