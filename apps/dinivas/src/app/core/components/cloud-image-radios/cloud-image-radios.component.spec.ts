import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CloudImageRadiosComponent } from './cloud-image-radios.component';

describe('CloudImageCheckboxComponent', () => {
  let component: CloudImageRadiosComponent;
  let fixture: ComponentFixture<CloudImageRadiosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CloudImageRadiosComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloudImageRadiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
