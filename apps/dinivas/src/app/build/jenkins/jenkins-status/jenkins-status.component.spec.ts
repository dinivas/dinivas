import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { JenkinsStatusComponent } from './jenkins-status.component';

describe('JenkinsStatusComponent', () => {
  let component: JenkinsStatusComponent;
  let fixture: ComponentFixture<JenkinsStatusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JenkinsStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JenkinsStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
