import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PostgresqlWizardVarsComponent } from './postgresql-wizard-vars.component';

describe('PostgresqlWizardVarsComponent', () => {
  let component: PostgresqlWizardVarsComponent;
  let fixture: ComponentFixture<PostgresqlWizardVarsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PostgresqlWizardVarsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostgresqlWizardVarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
