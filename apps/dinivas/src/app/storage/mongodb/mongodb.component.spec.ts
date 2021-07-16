import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MongodbComponent } from './mongodb.component';

describe('MongodbComponent', () => {
  let component: MongodbComponent;
  let fixture: ComponentFixture<MongodbComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MongodbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MongodbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
