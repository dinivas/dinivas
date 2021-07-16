import { RabbitMQDTO } from '@dinivas/api-interfaces';

export class ApplyRabbitMQCommand {
  constructor(
    public readonly cloudprovider: string,
    public readonly rabbitmq: RabbitMQDTO,
    public readonly workingDir: string
  ) {}
}
