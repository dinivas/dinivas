import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConsulStatusComponent } from './consul-status.component';

describe('ConsulStatusComponent', () => {
  let component: ConsulStatusComponent;
  let fixture: ComponentFixture<ConsulStatusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsulStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsulStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
