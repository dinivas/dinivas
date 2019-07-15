import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstancesComponent } from './instances.component';

describe('InstancesComponent', () => {
  let component: InstancesComponent;
  let fixture: ComponentFixture<InstancesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstancesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
