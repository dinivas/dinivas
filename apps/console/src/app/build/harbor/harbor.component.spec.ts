import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HarborComponent } from './harbor.component';

describe('HarborComponent', () => {
  let component: HarborComponent;
  let fixture: ComponentFixture<HarborComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HarborComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HarborComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
