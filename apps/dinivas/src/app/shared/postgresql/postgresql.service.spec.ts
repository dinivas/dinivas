import { TestBed } from '@angular/core/testing';

import { PostgresqlService } from './postgresql.service';

describe('PostgresqlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PostgresqlService = TestBed.get(PostgresqlService);
    expect(service).toBeTruthy();
  });
});
