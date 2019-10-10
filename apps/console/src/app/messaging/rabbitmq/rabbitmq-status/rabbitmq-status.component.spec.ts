import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RabbitmqStatusComponent } from './rabbitmq-status.component';

describe('RabbitmqStatusComponent', () => {
  let component: RabbitmqStatusComponent;
  let fixture: ComponentFixture<RabbitmqStatusComponent>;

  beforeEach(async(() => {
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
