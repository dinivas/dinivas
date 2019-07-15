import { TestBed, async, inject } from '@angular/core/testing';

import { MandatorySelectedProjectGuard } from './mandatory-selected-project.guard';

describe('MandatorySelectedProjectGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MandatorySelectedProjectGuard]
    });
  });

  it('should ...', inject([MandatorySelectedProjectGuard], (guard: MandatorySelectedProjectGuard) => {
    expect(guard).toBeTruthy();
  }));
});
