import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RepoContentDetailComponent } from './repo-content-detail.component';

describe('RepoContentDetailComponent', () => {
  let component: RepoContentDetailComponent;
  let fixture: ComponentFixture<RepoContentDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RepoContentDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepoContentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
