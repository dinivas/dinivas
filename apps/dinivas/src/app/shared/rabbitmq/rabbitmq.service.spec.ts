import { TestBed } from '@angular/core/testing';

import { RabbitMQService } from './rabbitmq.service';

describe('RabbitMQService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RabbitMQService = TestBed.get(RabbitMQService);
    expect(service).toBeTruthy();
  });
});
