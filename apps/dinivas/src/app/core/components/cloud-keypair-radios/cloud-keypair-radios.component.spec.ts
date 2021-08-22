import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CloudKeyPairRadiosComponent } from './cloud-keypair-radios.component';

describe('CloudFlavorCheckboxComponent', () => {
  let component: CloudKeyPairRadiosComponent;
  let fixture: ComponentFixture<CloudKeyPairRadiosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CloudKeyPairRadiosComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloudKeyPairRadiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
