import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerMonitorStatusComponent } from './server-monitor-status.component';

describe('ServerMonitorStatusComponent', () => {
  let component: ServerMonitorStatusComponent;
  let fixture: ComponentFixture<ServerMonitorStatusComponent>;

  beforeEach(async(() => {
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
