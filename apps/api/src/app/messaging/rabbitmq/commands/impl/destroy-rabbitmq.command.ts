import { RabbitMQDTO, ConsulDTO } from '@dinivas/api-interfaces';

export class DestroyRabbitMQCommand {
  constructor(
    public readonly cloudprovider: string,
    public readonly rabbitmq: RabbitMQDTO,
    public readonly consul: ConsulDTO,
    public readonly cloudConfig: any
  ) {}
}
