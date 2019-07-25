import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KafkaComponent } from './kafka.component';

describe('KafkaComponent', () => {
  let component: KafkaComponent;
  let fixture: ComponentFixture<KafkaComponent>;

  beforeEach(async(() => {
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
