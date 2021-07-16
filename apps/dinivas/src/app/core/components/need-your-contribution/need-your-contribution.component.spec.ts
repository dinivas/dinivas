import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NeedYourContributionComponent } from './need-your-contribution.component';

describe('NeedYourContributionComponent', () => {
  let component: NeedYourContributionComponent;
  let fixture: ComponentFixture<NeedYourContributionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NeedYourContributionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeedYourContributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
