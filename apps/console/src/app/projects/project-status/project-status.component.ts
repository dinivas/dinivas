import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectDTO } from '@dinivas/dto';
import { map } from 'rxjs/operators';
import { TerraformModuleEntityInfo } from '../../shared/terraform/terraform-module-entity-info';

@Component({
  selector: 'dinivas-project-status',
  templateUrl: './project-status.component.html',
  styleUrls: []
})
export class ProjectStatusComponent implements OnInit {
  project: ProjectDTO;
  projectState: any;
  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data
      .pipe(
        map(
          (data: {
            currentProjectInfo: TerraformModuleEntityInfo<ProjectDTO>;
          }) => data.currentProjectInfo
        )
      )
      .subscribe(
        async (projectInfo: TerraformModuleEntityInfo<ProjectDTO>) => {
          this.project = projectInfo.entity;
          this.projectState = projectInfo.entityState;
        }
      );
  }
}
