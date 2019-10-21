import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstanceWizardComponent } from './instance-wizard.component';

describe('InstanceWizardComponent', () => {
  let component: InstanceWizardComponent;
  let fixture: ComponentFixture<InstanceWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstanceWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstanceWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
