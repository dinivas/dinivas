import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PostgresqlComponent } from './postgresql.component';

describe('PostgresqlComponent', () => {
  let component: PostgresqlComponent;
  let fixture: ComponentFixture<PostgresqlComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PostgresqlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostgresqlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
