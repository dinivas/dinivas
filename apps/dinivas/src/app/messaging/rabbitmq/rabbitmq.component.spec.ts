import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RabbitmqComponent } from './rabbitmq.component';

describe('RabbitmqComponent', () => {
  let component: RabbitmqComponent;
  let fixture: ComponentFixture<RabbitmqComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RabbitmqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RabbitmqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
