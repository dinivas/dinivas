import { ApplyRabbitMQHandler } from './apply-rabbitmq.handler';
import { PlanRabbitMQHandler } from './plan-rabbitmq.handler';
import { DestroyRabbitMQHandler } from './destroy-rabbitmq.handler';
export const CommandHandlers = [
  PlanRabbitMQHandler,
  ApplyRabbitMQHandler,
  DestroyRabbitMQHandler
];
