import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OpenshiftComponent } from './openshift.component';

describe('OpenshiftComponent', () => {
  let component: OpenshiftComponent;
  let fixture: ComponentFixture<OpenshiftComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenshiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenshiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
