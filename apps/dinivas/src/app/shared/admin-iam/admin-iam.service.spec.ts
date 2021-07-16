import { TestBed } from '@angular/core/testing';

import { AdminIamService } from './admin-iam.service';

describe('IamService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminIamService = TestBed.get(AdminIamService);
    expect(service).toBeTruthy();
  });
});
