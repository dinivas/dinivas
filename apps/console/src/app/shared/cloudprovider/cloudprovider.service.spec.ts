import { TestBed } from '@angular/core/testing';

import { CloudproviderService } from './cloudprovider.service';

describe('CloudproviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CloudproviderService = TestBed.get(CloudproviderService);
    expect(service).toBeTruthy();
  });
});
