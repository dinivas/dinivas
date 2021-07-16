import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HarborComponent } from './harbor.component';

describe('HarborComponent', () => {
  let component: HarborComponent;
  let fixture: ComponentFixture<HarborComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HarborComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HarborComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
