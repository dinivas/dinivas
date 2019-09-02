import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchitectureTypeRadiosComponent } from './architecture-type-radios.component';

describe('CloudImageCheckboxComponent', () => {
  let component: ArchitectureTypeRadiosComponent;
  let fixture: ComponentFixture<ArchitectureTypeRadiosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ArchitectureTypeRadiosComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchitectureTypeRadiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
