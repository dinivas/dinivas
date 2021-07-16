import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GitlabWizardComponent } from './gitlab-wizard.component';

describe('GitlabWizardComponent', () => {
  let component: GitlabWizardComponent;
  let fixture: ComponentFixture<GitlabWizardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GitlabWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GitlabWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
