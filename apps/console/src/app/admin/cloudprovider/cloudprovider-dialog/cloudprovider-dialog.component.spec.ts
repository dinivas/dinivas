import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloudproviderDialogComponent } from './cloudprovider-dialog.component';

describe('CloudproviderDialogComponent', () => {
  let component: CloudproviderDialogComponent;
  let fixture: ComponentFixture<CloudproviderDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloudproviderDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloudproviderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
