import { environment } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dinivas-server-monitor-status',
  templateUrl: './server-monitor-status.component.html',
  styleUrls: ['./server-monitor-status.component.scss']
})
export class ServerMonitorStatusComponent implements OnInit {

  monitorStatusUrl= `${environment.apiUrl}/status-monitor`;

  constructor() { }

  ngOnInit() {
  }

}
