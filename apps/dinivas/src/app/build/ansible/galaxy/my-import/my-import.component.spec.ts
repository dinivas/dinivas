import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyImportComponent } from './my-import.component';

describe('MyImportComponent', () => {
  let component: MyImportComponent;
  let fixture: ComponentFixture<MyImportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MyImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
