import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatCrudComponent } from './mat-crud.component';

describe('MatCrudComponent', () => {
  let component: MatCrudComponent;
  let fixture: ComponentFixture<MatCrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatCrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
