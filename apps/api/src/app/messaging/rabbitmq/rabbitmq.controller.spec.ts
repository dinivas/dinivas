import { Test, TestingModule } from '@nestjs/testing';
import { RabbitMQController } from './rabbitmq.controller';

describe('Jenkins Controller', () => {
  let controller: RabbitMQController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RabbitMQController]
    }).compile();

    controller = module.get<RabbitMQController>(RabbitMQController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
