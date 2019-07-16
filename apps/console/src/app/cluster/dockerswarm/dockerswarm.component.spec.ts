import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DockerswarmComponent } from './dockerswarm.component';

describe('DockerswarmComponent', () => {
  let component: DockerswarmComponent;
  let fixture: ComponentFixture<DockerswarmComponent>;

  beforeEach(async(() => {
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
