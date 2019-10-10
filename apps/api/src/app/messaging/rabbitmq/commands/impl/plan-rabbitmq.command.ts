import { RabbitMQDTO, ConsulDTO } from '@dinivas/dto';

export class PlanRabbitMQCommand {
  constructor(
    public readonly rabbitmq: RabbitMQDTO,
    public readonly consul: ConsulDTO,
    public readonly cloudConfig: any
  ) {}
}
