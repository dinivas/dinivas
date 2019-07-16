import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectProjectDialogComponent } from './select-project-dialog.component';

describe('SelectProjectDialogComponent', () => {
  let component: SelectProjectDialogComponent;
  let fixture: ComponentFixture<SelectProjectDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectProjectDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectProjectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
