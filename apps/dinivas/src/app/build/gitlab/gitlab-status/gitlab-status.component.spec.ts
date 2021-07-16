import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GitlabStatusComponent } from './gitlab-status.component';

describe('GitlabStatusComponent', () => {
  let component: GitlabStatusComponent;
  let fixture: ComponentFixture<GitlabStatusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GitlabStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GitlabStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
