import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GalaxyComponent } from './galaxy.component';

describe('GalaxyComponent', () => {
  let component: GalaxyComponent;
  let fixture: ComponentFixture<GalaxyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GalaxyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalaxyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
