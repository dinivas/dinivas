import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GitlabComponent } from './gitlab.component';

describe('GitlabComponent', () => {
  let component: GitlabComponent;
  let fixture: ComponentFixture<GitlabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GitlabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GitlabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
