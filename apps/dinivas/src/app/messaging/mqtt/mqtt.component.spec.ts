import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MqttComponent } from './mqtt.component';

describe('MqttComponent', () => {
  let component: MqttComponent;
  let fixture: ComponentFixture<MqttComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MqttComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MqttComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
