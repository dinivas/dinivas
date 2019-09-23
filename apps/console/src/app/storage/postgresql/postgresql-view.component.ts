import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { PostgresqlDTO } from '@dinivas/dto';

@Component({
  selector: 'dinivas-postgresql-view',
  template: `
    <mat-toolbar class="header-toolbar">
      <button
        mat-icon-button
        color="primary"
        [routerLink]="['/build', 'postgresql']"
        queryParamsHandling="merge"
      >
        <mat-icon>arrow_back</mat-icon>
      </button>
      <span class="page-title">{{
        'Viewing postgresql ' + postgresql.code
      }}</span>
    </mat-toolbar>
    <nav mat-tab-nav-bar class="postgresql-view-nav">
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
export class PostgresqlViewComponent implements OnInit {
  postgresql: PostgresqlDTO;
  constructor(private activatedRoute: ActivatedRoute) {}
  ngOnInit() {
    this.activatedRoute.data
      .pipe(map((data: { postgresql: PostgresqlDTO }) => data.postgresql))
      .subscribe((postgresql: PostgresqlDTO) => (this.postgresql = postgresql));
  }
}
