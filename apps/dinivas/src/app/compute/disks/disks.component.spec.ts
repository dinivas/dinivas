import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DisksComponent } from './disks.component';

describe('DisksComponent', () => {
  let component: DisksComponent;
  let fixture: ComponentFixture<DisksComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DisksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
