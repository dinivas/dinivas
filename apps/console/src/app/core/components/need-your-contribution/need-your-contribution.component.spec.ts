import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeedYourContributionComponent } from './need-your-contribution.component';

describe('NeedYourContributionComponent', () => {
  let component: NeedYourContributionComponent;
  let fixture: ComponentFixture<NeedYourContributionComponent>;

  beforeEach(async(() => {
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
