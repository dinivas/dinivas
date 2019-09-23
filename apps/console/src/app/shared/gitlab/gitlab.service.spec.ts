import { TestBed } from '@angular/core/testing';

import { GitlabService } from './gitlab.service';

describe('GitlabService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GitlabService = TestBed.get(GitlabService);
    expect(service).toBeTruthy();
  });
});
