import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepoContentDetailComponent } from './repo-content-detail.component';

describe('RepoContentDetailComponent', () => {
  let component: RepoContentDetailComponent;
  let fixture: ComponentFixture<RepoContentDetailComponent>;

  beforeEach(async(() => {
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
