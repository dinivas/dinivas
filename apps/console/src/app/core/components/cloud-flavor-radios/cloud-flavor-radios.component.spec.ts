import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloudFlavorRadiosComponent } from './cloud-flavor-radios.component';

describe('CloudFlavorCheckboxComponent', () => {
  let component: CloudFlavorRadiosComponent;
  let fixture: ComponentFixture<CloudFlavorRadiosComponent>;

  beforeEach(async(() => {
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
