import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RabbitmqStatusComponent } from './rabbitmq-status.component';

describe('RabbitmqStatusComponent', () => {
  let component: RabbitmqStatusComponent;
  let fixture: ComponentFixture<RabbitmqStatusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RabbitmqStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RabbitmqStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
