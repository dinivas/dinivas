import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ServerMonitorStatusComponent } from './server-monitor-status.component';

describe('ServerMonitorStatusComponent', () => {
  let component: ServerMonitorStatusComponent;
  let fixture: ComponentFixture<ServerMonitorStatusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ServerMonitorStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerMonitorStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
