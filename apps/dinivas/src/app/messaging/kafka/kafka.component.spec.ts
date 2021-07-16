import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { KafkaComponent } from './kafka.component';

describe('KafkaComponent', () => {
  let component: KafkaComponent;
  let fixture: ComponentFixture<KafkaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ KafkaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KafkaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
