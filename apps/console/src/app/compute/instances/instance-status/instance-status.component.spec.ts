import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstanceStatusComponent } from './instance-status.component';

describe('InstanceStatusComponent', () => {
  let component: InstanceStatusComponent;
  let fixture: ComponentFixture<InstanceStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstanceStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstanceStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
