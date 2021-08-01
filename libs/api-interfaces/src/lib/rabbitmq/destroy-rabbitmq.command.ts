import { ConsulDTO } from './../consul/consul.dto';
import { RabbitMQDTO } from './rabbitmq.dto';

export class DestroyRabbitMQCommand {
  constructor(
    public readonly cloudprovider: string,
    public readonly rabbitmq: RabbitMQDTO,
    public readonly consul: ConsulDTO,
    public readonly cloudConfig: any
  ) {}

  static from<T extends DestroyRabbitMQCommand>(
    json: T
  ): DestroyRabbitMQCommand {
    return new DestroyRabbitMQCommand(
      json.cloudprovider,
      json.rabbitmq,
      json.consul,
      json.cloudConfig
    );
  }
}
