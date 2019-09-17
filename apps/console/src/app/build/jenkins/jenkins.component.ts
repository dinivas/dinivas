import { FilterType } from './../../core/entity/filter-bar/filter';
import { map } from 'rxjs/operators';
import { Observable, Observer } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmDialogService } from './../../core/dialog/confirm-dialog/confirm-dialog.service';
import { JenkinsService } from './../../shared/jenkins/jenkins.service';
import { MatDialog } from '@angular/material';
import { ColumnDef } from './../../core/entity/mat-crud/column-def';
import { DataProvider } from './../../core/entity/mat-crud/data-provider';
import { JenkinsDTO, Pagination } from '@dinivas/dto';
import { MatCrudComponent } from './../../core/entity/mat-crud/mat-crud.component';
import { Component } from '@angular/core';

@Component({
  selector: 'dinivas-jenkins',
  templateUrl: './jenkins.component.html',
  styleUrls: ['./jenkins.component.scss']
})
export class JenkinsComponent extends MatCrudComponent
  implements DataProvider<JenkinsDTO> {
  filterPlaceholder = 'Filter';
  dataProvider = this;
  jenkinsList: JenkinsDTO[] = [];
  deleteConfirmQuestion: Function = entity =>
    `Delete jenkins ${
      entity.code
    } ? This will also destroy all attached resources.`;

  columnDefs: Array<ColumnDef>;
  constructor(
    public dialog: MatDialog,
    private readonly jenkinsService: JenkinsService,
    public confirmDialog: ConfirmDialogService,
    private readonly router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super(confirmDialog);
    activatedRoute.data
      .pipe(
        map(
          (data: { jenkinsPage: Pagination<JenkinsDTO> }) =>
            data.jenkinsPage.items
        )
      )
      .subscribe((jenkins: JenkinsDTO[]) => (this.jenkinsList = jenkins));
    this.columnDefs = [
      new ColumnDef('id', 'Id', false, false, false),
      new ColumnDef('code', 'Code', true, true, false, FilterType.TEXT),
      new ColumnDef('managed_master', 'Is Master managed?', false),
      new ColumnDef('description', 'Description', false),
      new ColumnDef('slave_groups', 'Slaves', false)
    ];
  }

  getDatas(httpParams: HttpParams): Observable<any> {
    const newFilter = JSON.parse(httpParams.get('filter'));
    const newHttpParams = new HttpParams()
      .set('filter', JSON.stringify(newFilter))
      .set('page', httpParams.get('page'))
      .set('limit', httpParams.get('limit'))
      .set('sort', httpParams.get('sort'));
    return this.jenkinsService.get(newHttpParams);
  }

  dataChanged(jenkins: JenkinsDTO[]) {
    this.jenkinsList = jenkins;
  }

  addJenkins() {
    this.router.navigate(['/build/jenkins/new'], { preserveQueryParams: true });
  }

  deleteSelected(selection: any[]): Observable<any> {
    return Observable.create((observer: Observer<any>) => {});
  }
  delete(jenkinsDTO: JenkinsDTO): Observable<any> {
    return this.jenkinsService.delete(jenkinsDTO.id);
  }

  entityCanEdit = (jenkinsDTO: JenkinsDTO) => true;

  entityEdit(jenkinsDTO: JenkinsDTO) {}
}
