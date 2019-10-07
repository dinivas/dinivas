import { ProjectWizardComponent } from './project-wizard/project-wizard.component';
import { Observer } from 'rxjs/';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ConfirmDialogService } from './../core/dialog/confirm-dialog/confirm-dialog.service';
import { FilterType } from './../core/entity/filter-bar/filter';
import { ColumnDef } from './../core/entity/mat-crud/column-def';
import { MatDialog } from '@angular/material';
import { ProjectDTO } from '@dinivas/dto';
import { MatCrudComponent } from './../core/entity/mat-crud/mat-crud.component';
import { Component } from '@angular/core';
import { DataProvider } from '../core/entity/mat-crud/data-provider';
import { ProjectsService } from '../shared/project/projects.service';
import { Router } from '@angular/router';

@Component({
  selector: 'dinivas-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent extends MatCrudComponent
  implements DataProvider<ProjectDTO> {
  filterPlaceholder = 'Filter';
  dataProvider = this;
  deleteConfirmQuestion: Function = entity =>
    `Delete project ${entity.name} (${
      entity.code
    }) ? This will also destroy all project resources.`;

  columnDefs: Array<ColumnDef>;

  constructor(
    public dialog: MatDialog,
    private readonly projectService: ProjectsService,
    public confirmDialog: ConfirmDialogService,
    private readonly router: Router
  ) {
    super(confirmDialog);
    this.columnDefs = [
      new ColumnDef('id', 'Id', true, false, false, FilterType.TEXT),
      new ColumnDef('name', 'Name', true, true, false, FilterType.TEXT),
      new ColumnDef('code', 'Code', true, true, false, FilterType.TEXT),
      new ColumnDef('description', 'Description', false),
      new ColumnDef('availability_zone', 'Availability zone', false),
      new ColumnDef('cloud_provider', 'Cloud config', false),
      new ColumnDef('monitoring', 'Monitoring', false),
      new ColumnDef('logging', 'Logging', false)
    ];
  }

  getDatas(httpParams: HttpParams): Observable<any> {
    const newFilter = JSON.parse(httpParams.get('filter'));
    const newHttpParams = new HttpParams()
      .set('filter', JSON.stringify(newFilter))
      .set('page', httpParams.get('page'))
      .set('limit', httpParams.get('limit'))
      .set('sort', httpParams.get('sort'));
    return this.projectService.getProjects(newHttpParams);
  }

  addProject() {
    this.router.navigate(['/projects/new'], { preserveQueryParams: true });
    // const addEntityDialogRef = this.dialog.open(ProjectWizardComponent, {
    //   maxWidth: '90vw',
    //   width: '80vw',
    //   //height: '90vw',
    //   minHeight: '600px',
    //   disableClose: true
    // });

    // addEntityDialogRef.afterClosed().subscribe(
    //   result => {
    //     if (result) {
    //       this.refreshDatas();
    //     }
    //   },
    //   err => console.log(err)
    // );
  }

  deleteSelected(selection: any[]): Observable<any> {
    return Observable.create((observer: Observer<any>) => {});
  }
  delete(projectDTO: ProjectDTO): Observable<any> {
    return this.projectService.deleteProject(projectDTO.id);
  }

  entityCanEdit = (projectDTO: ProjectDTO) => true;
  public entityCanDelete = (projectDTO: ProjectDTO) => true;

  entityEdit(projectDTO: ProjectDTO) {}
}
