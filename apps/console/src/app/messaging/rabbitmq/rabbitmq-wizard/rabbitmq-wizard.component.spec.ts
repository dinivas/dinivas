import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RabbitmqWizardComponent } from './rabbitmq-wizard.component';

describe('RabbitmqWizardComponent', () => {
  let component: RabbitmqWizardComponent;
  let fixture: ComponentFixture<RabbitmqWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RabbitmqWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RabbitmqWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
