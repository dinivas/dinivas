import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConsulComponent } from './consul.component';

describe('ConsulComponent', () => {
  let component: ConsulComponent;
  let fixture: ComponentFixture<ConsulComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsulComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsulComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
