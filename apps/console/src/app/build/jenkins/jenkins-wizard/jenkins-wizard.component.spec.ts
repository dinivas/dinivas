import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JenkinsWizardComponent } from './jenkins-wizard.component';

describe('JenkinsWizardComponent', () => {
  let component: JenkinsWizardComponent;
  let fixture: ComponentFixture<JenkinsWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JenkinsWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JenkinsWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
