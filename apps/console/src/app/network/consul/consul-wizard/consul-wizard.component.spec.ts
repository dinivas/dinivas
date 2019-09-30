import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsulWizardComponent } from './consul-wizard.component';

describe('ConsulWizardComponent', () => {
  let component: ConsulWizardComponent;
  let fixture: ComponentFixture<ConsulWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsulWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsulWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
