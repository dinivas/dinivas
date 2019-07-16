import { ActivatedRoute } from '@angular/router';
import { ProjectsService } from '../../../shared/project/projects.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { ProjectDTO } from '@dinivas/dto';
import { HttpParams } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'dinivas-select-project-dialog',
  templateUrl: './select-project-dialog.component.html',
  styleUrls: ['./select-project-dialog.component.scss']
})
export class SelectProjectDialogComponent implements OnInit, OnDestroy {
  projects: ProjectDTO[];
  nextState: string;
  routeSubscription: Subscription;

  constructor(
    public dialogRef: MatDialogRef<SelectProjectDialogComponent>,
    private projectService: ProjectsService,
    private activatedRoute: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.routeSubscription = this.activatedRoute.queryParams.subscribe(params => {
      this.nextState = params['nextState'];
    });
    this.projectService.getProjects(new HttpParams()).subscribe((data: any) => {
      this.projects = data.items;
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) this.routeSubscription.unsubscribe();
  }
  onCancelClick(project): void {
    this.dialogRef.close(project);
  }
}
@Component({
  template: ''
})
export class SelectProjectDialogEntryComponent implements OnInit {
  constructor(public dialog: MatDialog) {
    this.openDialog();
  }

  ngOnInit() {}

  openDialog(): void {
    const dialogRef = this.dialog.open(SelectProjectDialogComponent, {
      width: '400px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
