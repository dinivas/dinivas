import { async, TestBed } from '@angular/core/testing';
import { CommonUiModule } from './common-ui.module';

describe('CommonUiModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonUiModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(CommonUiModule).toBeDefined();
  });
});
