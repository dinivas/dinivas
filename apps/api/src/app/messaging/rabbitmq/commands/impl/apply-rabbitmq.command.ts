import { RabbitMQDTO } from '@dinivas/dto';

export class ApplyRabbitMQCommand {
  constructor(
    public readonly rabbitmq: RabbitMQDTO,
    public readonly workingDir: string
  ) {}
}
