import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectDTO, JenkinsDTO } from '@dinivas/dto';
import { map } from 'rxjs/operators';

@Component({
  selector: 'dinivas-jenkins-status',
  templateUrl: './jenkins-status.component.html',
  styleUrls: ['./jenkins-status.component.scss']
})
export class JenkinsStatusComponent implements OnInit {
  jenkins: JenkinsDTO;
  project: ProjectDTO;
  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data
      .pipe(map((data: { moduleEntity: JenkinsDTO }) => data.moduleEntity))
      .subscribe((jenkins: JenkinsDTO) => {
        this.jenkins = jenkins;
      });
    this.activatedRoute.data
      .pipe(
        map(
          (data: {
            currentProjectInfo: { project: ProjectDTO; projectState: any };
          }) => data.currentProjectInfo
        )
      )
      .subscribe((projectInfo: { project: ProjectDTO; projectState: any }) => {
        this.project = projectInfo.project;
      });
  }
}
