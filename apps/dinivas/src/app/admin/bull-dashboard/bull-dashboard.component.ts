import { Component, OnInit } from '@angular/core';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'dinivas-bull-dashboard',
  templateUrl: './bull-dashboard.component.html',
  styleUrls: ['./bull-dashboard.component.scss'],
})
export class BullDashboardComponent implements OnInit {
  bullDashboardUrl = `${environment.apiUrl}/bull/queues`;
  constructor() {}

  ngOnInit(): void {}
}
