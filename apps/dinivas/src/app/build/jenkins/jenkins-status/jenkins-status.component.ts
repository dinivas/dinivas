import { TerraformModuleEntityInfo } from './../../../shared/terraform/terraform-module-entity-info';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectDTO, JenkinsDTO } from '@dinivas/api-interfaces';
import { map } from 'rxjs/operators';

@Component({
  selector: 'dinivas-jenkins-status',
  templateUrl: './jenkins-status.component.html',
  styleUrls: ['./jenkins-status.component.scss']
})
export class JenkinsStatusComponent implements OnInit {
  jenkins: JenkinsDTO;
  jenkinsState: any;
  project: ProjectDTO;
  projectState: any;
  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data
      .pipe(
        map(
          (data) => data.currentJenkinsInfo
        )
      )
      .subscribe(
        (currentJenkinsInfo: TerraformModuleEntityInfo<JenkinsDTO>) => {
          this.jenkins = currentJenkinsInfo
            ? currentJenkinsInfo.entity
            : undefined;
          this.jenkinsState = currentJenkinsInfo
            ? currentJenkinsInfo.entityState
            : undefined;
        }
      );
    this.activatedRoute.data
      .pipe(
        map(
          (data) => data.currentProjectInfo
        )
      )
      .subscribe((projectInfo: TerraformModuleEntityInfo<ProjectDTO>) => {
        this.project = projectInfo ? projectInfo.entity : undefined;
        this.projectState = projectInfo ? projectInfo.entityState : undefined;
      });
  }
}
