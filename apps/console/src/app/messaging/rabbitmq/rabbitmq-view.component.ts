import { RabbitMQDTO } from '@dinivas/dto';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'dinivas-rabbitmq-view',
  template: `
    <mat-toolbar class="header-toolbar">
      <button
        mat-icon-button
        color="primary"
        [routerLink]="['/build', 'rabbitmq']"
        queryParamsHandling="merge"
      >
        <mat-icon>arrow_back</mat-icon>
      </button>
      <span class="page-title">{{ 'Viewing RabbitMQ ' + rabbitmq.code }}</span>
    </mat-toolbar>
    <nav mat-tab-nav-bar class="rabbitmq-view-nav">
      <a
        mat-tab-link
        routerLinkActive
        #rlaStatus="routerLinkActive"
        [active]="rlaStatus.isActive"
        routerLink="status"
        >Status</a
      >
      <a
        mat-tab-link
        routerLinkActive
        #rlaEdit="routerLinkActive"
        [active]="rlaEdit.isActive"
        routerLink="edit"
        >Edit</a
      >
    </nav>
    <div class="">
      <router-outlet></router-outlet>
    </div>
  `
})
export class RabbitMQViewComponent implements OnInit {
  rabbitmq: RabbitMQDTO;
  constructor(private activatedRoute: ActivatedRoute) {}
  ngOnInit() {
    this.activatedRoute.data
      .pipe(map((data: { rabbitmq: RabbitMQDTO }) => data.rabbitmq))
      .subscribe((rabbitmq: RabbitMQDTO) => (this.rabbitmq = rabbitmq));
  }
}