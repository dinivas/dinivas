import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CloudFlavorRadiosComponent } from './cloud-flavor-radios.component';

describe('CloudFlavorCheckboxComponent', () => {
  let component: CloudFlavorRadiosComponent;
  let fixture: ComponentFixture<CloudFlavorRadiosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CloudFlavorRadiosComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloudFlavorRadiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
