import { ProjectsService } from './../../shared/project/projects.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ProjectDTO, ICloudApiProjectQuotaDetail } from '@dinivas/api-interfaces';

@Component({
  selector: 'dinivas-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  currentSelectedProject: Observable<ProjectDTO>;
  ramQuota: ICloudApiProjectQuotaDetail;
  coresQuota: ICloudApiProjectQuotaDetail;
  instancesQuota: ICloudApiProjectQuotaDetail;
  floatIpQuota: ICloudApiProjectQuotaDetail;
  constructor(private projectService: ProjectsService) {}

  ngOnInit() {
    this.currentSelectedProject = this.projectService.currentSelectedProject;
    this.currentSelectedProject.subscribe(p=>{
      this.projectService.getProjectQuota(p.id).subscribe(quota => {
        this.ramQuota = quota.ram;
        this.coresQuota = quota.cores;
        this.instancesQuota = quota.instances;
        this.floatIpQuota = quota.floating_ips;
      });
    });
  }
}
