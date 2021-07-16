import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RedisComponent } from './redis.component';

describe('RedisComponent', () => {
  let component: RedisComponent;
  let fixture: ComponentFixture<RedisComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RedisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
