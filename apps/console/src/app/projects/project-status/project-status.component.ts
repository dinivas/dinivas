import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectDTO } from '@dinivas/dto';
import { map } from 'rxjs/operators';

@Component({
  selector: 'dinivas-project-status',
  templateUrl: './project-status.component.html',
  styleUrls: []
})
export class ProjectStatusComponent implements OnInit {
  project: ProjectDTO;
  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data
      .pipe(
        map(
          (data: {
            currentProjectInfo: { project: ProjectDTO; projectState: any };
          }) => data.currentProjectInfo
        )
      )
      .subscribe(
        async (projectInfo: { project: ProjectDTO; projectState: any }) => {
          this.project = projectInfo && projectInfo.project;
        }
      );
  }
}
