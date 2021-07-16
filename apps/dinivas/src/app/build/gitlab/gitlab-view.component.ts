import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { GitlabDTO } from '@dinivas/api-interfaces';

@Component({
  selector: 'dinivas-gitlab-view',
  template: `
    <mat-toolbar class="header-toolbar">
      <button
        mat-icon-button
        color="primary"
        [routerLink]="['/build', 'gitlab']"
        queryParamsHandling="merge"
      >
        <mat-icon>arrow_back</mat-icon>
      </button>
      <span class="page-title">{{ 'Viewing gitlab ' + gitlab.code }}</span>
    </mat-toolbar>
    <nav mat-tab-nav-bar class="gitlab-view-nav">
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
export class GitlabViewComponent implements OnInit {
  gitlab: GitlabDTO;
  constructor(private activatedRoute: ActivatedRoute) {}
  ngOnInit() {
    this.activatedRoute.data
      .pipe(map((data: { gitlab: GitlabDTO }) => data.gitlab))
      .subscribe((gitlab: GitlabDTO) => (this.gitlab = gitlab));
  }
}
