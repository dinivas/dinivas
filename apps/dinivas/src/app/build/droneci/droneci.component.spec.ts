import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DroneciComponent } from './droneci.component';

describe('DroneciComponent', () => {
  let component: DroneciComponent;
  let fixture: ComponentFixture<DroneciComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DroneciComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DroneciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
