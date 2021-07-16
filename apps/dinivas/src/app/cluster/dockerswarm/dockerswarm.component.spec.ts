import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DockerswarmComponent } from './dockerswarm.component';

describe('DockerswarmComponent', () => {
  let component: DockerswarmComponent;
  let fixture: ComponentFixture<DockerswarmComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DockerswarmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DockerswarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
