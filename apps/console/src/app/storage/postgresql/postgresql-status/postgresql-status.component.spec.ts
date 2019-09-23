import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostgresqlStatusComponent } from './postgresql-status.component';

describe('PostgresqlStatusComponent', () => {
  let component: PostgresqlStatusComponent;
  let fixture: ComponentFixture<PostgresqlStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostgresqlStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostgresqlStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
