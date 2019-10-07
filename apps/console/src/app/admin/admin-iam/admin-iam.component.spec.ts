import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminIamComponent } from './admin-iam.component';

describe('IamComponent', () => {
  let component: AdminIamComponent;
  let fixture: ComponentFixture<AdminIamComponent>;

  beforeEach(async(() => {
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
