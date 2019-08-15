import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyContentComponent } from './my-content.component';

describe('MyContentComponent', () => {
  let component: MyContentComponent;
  let fixture: ComponentFixture<MyContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
