import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectDTO, RabbitMQDTO } from '@dinivas/api-interfaces';
import { TerraformModuleEntityInfo } from '../../../shared/terraform/terraform-module-entity-info';
import { map } from 'rxjs/operators';

@Component({
  selector: 'dinivas-rabbitmq-status',
  templateUrl: './rabbitmq-status.component.html',
  styleUrls: ['./rabbitmq-status.component.scss'],
})
export class RabbitmqStatusComponent implements OnInit {
  rabbitmq: RabbitMQDTO;
  rabbitmqState: any;
  project: ProjectDTO;
  projectState: any;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data
      .pipe(map((data) => data.currentRabbitmqInfo))
      .subscribe(
        (currentRabbitmqInfo: TerraformModuleEntityInfo<RabbitMQDTO>) => {
          this.rabbitmq = currentRabbitmqInfo
            ? currentRabbitmqInfo.entity
            : undefined;
          this.rabbitmqState = currentRabbitmqInfo
            ? currentRabbitmqInfo.entityState
            : undefined;
        }
      );
    this.activatedRoute.data
      .pipe(map((data) => data.currentProjectInfo))
      .subscribe((projectInfo: TerraformModuleEntityInfo<ProjectDTO>) => {
        this.project = projectInfo ? projectInfo.entity : undefined;
        this.projectState = projectInfo ? projectInfo.entityState : undefined;
      });
  }
}
