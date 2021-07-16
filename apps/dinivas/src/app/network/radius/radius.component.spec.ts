import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RadiusComponent } from './radius.component';

describe('RadiusComponent', () => {
  let component: RadiusComponent;
  let fixture: ComponentFixture<RadiusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RadiusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
