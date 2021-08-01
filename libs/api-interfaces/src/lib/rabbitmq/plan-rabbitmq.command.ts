import { ConsulDTO } from './../consul/consul.dto';
import { RabbitMQDTO } from './rabbitmq.dto';

export class PlanRabbitMQCommand {
  constructor(
    public readonly cloudprovider: string,
    public readonly rabbitmq: RabbitMQDTO,
    public readonly consul: ConsulDTO,
    public readonly cloudConfig: any
  ) {}

  static from<T extends PlanRabbitMQCommand>(json: T): PlanRabbitMQCommand {
    return new PlanRabbitMQCommand(
      json.cloudprovider,
      json.rabbitmq,
      json.consul,
      json.cloudConfig
    );
  }
}
