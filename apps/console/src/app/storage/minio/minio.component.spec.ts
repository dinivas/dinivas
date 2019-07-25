import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinioComponent } from './minio.component';

describe('MinioComponent', () => {
  let component: MinioComponent;
  let fixture: ComponentFixture<MinioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
