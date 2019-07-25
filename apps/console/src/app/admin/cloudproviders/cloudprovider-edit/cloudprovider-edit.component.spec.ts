import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloudproviderEditComponent } from './cloudprovider-edit.component';

describe('CloudproviderEditComponent', () => {
  let component: CloudproviderEditComponent;
  let fixture: ComponentFixture<CloudproviderEditComponent>;

  beforeEach(async(() => {
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
