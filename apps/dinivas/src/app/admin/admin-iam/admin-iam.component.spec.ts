import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminIamComponent } from './admin-iam.component';

describe('IamComponent', () => {
  let component: AdminIamComponent;
  let fixture: ComponentFixture<AdminIamComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminIamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminIamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
