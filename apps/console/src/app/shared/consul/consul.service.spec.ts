import { TestBed } from '@angular/core/testing';

import { ConsulService } from './consul.service';

describe('ConsulService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConsulService = TestBed.get(ConsulService);
    expect(service).toBeTruthy();
  });
});
