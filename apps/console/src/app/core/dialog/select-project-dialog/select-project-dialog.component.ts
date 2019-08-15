import { CloudproviderService } from './../../../shared/cloudprovider/cloudprovider.service';
import { ActivatedRoute } from '@angular/router';
import { ProjectsService } from '../../../shared/project/projects.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProjectDTO, CloudproviderDTO } from '@dinivas/dto';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'dinivas-select-project-dialog',
  templateUrl: './select-project-dialog.component.html',
  styleUrls: ['./select-project-dialog.component.scss']
})
export class SelectProjectDialogComponent implements OnInit, OnDestroy {
  projects: ProjectDTO[];
  cloudproviders: CloudproviderDTO[];
  nextState: string;
  routeSubscription: Subscription;

  constructor(
    private projectService: ProjectsService,
    private cloudproviderService: CloudproviderService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.routeSubscription = this.activatedRoute.queryParams.subscribe(
      params => {
        this.nextState = params['nextState'];
      }
    );
    this.projectService.getProjects(new HttpParams()).subscribe(
      (data: any) => {
        this.projects = data.items;
        if (this.projects.length === 0) {
          this.loadCloudProviders();
        }
      },
      (res: HttpErrorResponse) => {
        this.projects = [];
        this.loadCloudProviders();
      }
    );
  }

  loadCloudProviders() {
    // Check if cloudproviders exist
    this.cloudproviderService
      .getCloudproviders(new HttpParams())
      .subscribe((res: any) => (this.cloudproviders = res.items));
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) this.routeSubscription.unsubscribe();
  }
  onCancelClick(project): void {
    
  }
  close() {
    
  }
}

