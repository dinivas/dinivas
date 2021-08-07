import { TerraformModuleEntityInfo } from './../../../shared/terraform/terraform-module-entity-info';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectDTO, GitlabDTO } from '@dinivas/api-interfaces';
import { map } from 'rxjs/operators';

@Component({
  selector: 'dinivas-gitlab-status',
  templateUrl: './gitlab-status.component.html',
  styleUrls: ['./gitlab-status.component.scss'],
})
export class GitlabStatusComponent implements OnInit {
  gitlab: GitlabDTO;
  gitlabState: any;
  project: ProjectDTO;
  projectState: any;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data
      .pipe(map((data) => data.currentGitlabInfo))
      .subscribe((currentGitlabInfo: TerraformModuleEntityInfo<GitlabDTO>) => {
        this.gitlab = currentGitlabInfo ? currentGitlabInfo.entity : undefined;
        this.gitlabState = currentGitlabInfo
          ? currentGitlabInfo.entityState
          : undefined;
      });
    this.activatedRoute.data
      .pipe(map((data) => data.currentProjectInfo))
      .subscribe((projectInfo: TerraformModuleEntityInfo<ProjectDTO>) => {
        this.project = projectInfo ? projectInfo.entity : undefined;
        this.projectState = projectInfo ? projectInfo.entityState : undefined;
      });
  }
}
