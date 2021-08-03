import { RabbitMQDTO } from './rabbitmq.dto';

export class ApplyRabbitMQCommand {
  constructor(
    public readonly cloudprovider: string,
    public readonly rabbitmq: RabbitMQDTO,
  ) {}

  static from<T extends ApplyRabbitMQCommand>(json: T): ApplyRabbitMQCommand {
    return new ApplyRabbitMQCommand(
      json.cloudprovider,
      json.rabbitmq,
    );
  }
}
