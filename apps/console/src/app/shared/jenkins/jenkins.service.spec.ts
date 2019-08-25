import { TestBed } from '@angular/core/testing';

import { JenkinsService } from './jenkins.service';

describe('JenkinsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JenkinsService = TestBed.get(JenkinsService);
    expect(service).toBeTruthy();
  });
});
