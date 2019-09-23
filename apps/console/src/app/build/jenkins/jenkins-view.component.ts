import { JenkinsDTO } from '@dinivas/dto';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'dinivas-jenkins-view',
  template: `
    <mat-toolbar class="header-toolbar">
      <button
        mat-icon-button
        color="primary"
        [routerLink]="['/build', 'jenkins']"
        queryParamsHandling="merge"
      >
        <mat-icon>arrow_back</mat-icon>
      </button>
      <span class="page-title">{{ 'Viewing Jenkins ' + jenkins.code }}</span>
    </mat-toolbar>
    <nav mat-tab-nav-bar class="jenkins-view-nav">
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
export class JenkinsViewComponent implements OnInit {
  jenkins: JenkinsDTO;
  constructor(private activatedRoute: ActivatedRoute) {}
  ngOnInit() {
    this.activatedRoute.data
      .pipe(map((data: { jenkins: JenkinsDTO }) => data.jenkins))
      .subscribe((jenkins: JenkinsDTO) => (this.jenkins = jenkins));
  }
}
