import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CloudproviderEditComponent } from './cloudprovider-edit.component';

describe('CloudproviderEditComponent', () => {
  let component: CloudproviderEditComponent;
  let fixture: ComponentFixture<CloudproviderEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CloudproviderEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloudproviderEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
