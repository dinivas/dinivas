import { ProjectDTO } from '@dinivas/api-interfaces';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { TerraformModuleEntityInfo } from '../shared/terraform/terraform-module-entity-info';

@Component({
  selector: 'dinivas-project-view',
  template: `
    <mat-toolbar class="header-toolbar">
      <button
        mat-icon-button
        color="primary"
        [routerLink]="['/projects']"
        queryParamsHandling="merge"
      >
        <mat-icon>arrow_back</mat-icon>
      </button>
      <span class="page-title">{{ 'Viewing Project ' + project.code }}</span>
    </mat-toolbar>
    <nav mat-tab-nav-bar class="project-view-nav">
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
export class ProjectViewComponent implements OnInit {
  project: ProjectDTO;
  constructor(private activatedRoute: ActivatedRoute) {}
  ngOnInit() {
    this.activatedRoute.data
      .pipe(
        map(
          (data) => data.currentProjectInfo
        )
      )
      .subscribe((projectInfo: TerraformModuleEntityInfo<ProjectDTO>) => {
        this.project = projectInfo.entity;
      });
  }
}
