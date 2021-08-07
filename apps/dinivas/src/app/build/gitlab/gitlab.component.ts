import { FilterType } from './../../core/entity/filter-bar/filter';
import { map } from 'rxjs/operators';
import { Observable, Observer } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmDialogService } from './../../core/dialog/confirm-dialog/confirm-dialog.service';
import { GitlabService } from './../../shared/gitlab/gitlab.service';
import { MatDialog } from '@angular/material/dialog';
import { ColumnDef } from './../../core/entity/mat-crud/column-def';
import { DataProvider } from './../../core/entity/mat-crud/data-provider';
import { GitlabDTO } from '@dinivas/api-interfaces';
import { MatCrudComponent } from './../../core/entity/mat-crud/mat-crud.component';
import { Component } from '@angular/core';

@Component({
  selector: 'dinivas-gitlab',
  templateUrl: './gitlab.component.html',
  styleUrls: ['./gitlab.component.scss'],
})
export class GitlabComponent
  extends MatCrudComponent
  implements DataProvider<GitlabDTO>
{
  filterPlaceholder = 'Filter';
  dataProvider = this;
  gitlabList: GitlabDTO[] = [];
  columnDefs: Array<ColumnDef>;
  deleteConfirmQuestion = (entity) =>
    `Delete gitlab ${entity.code} ? This will also destroy all attached resources.`;

  constructor(
    public dialog: MatDialog,
    private readonly gitlabService: GitlabService,
    public confirmDialog: ConfirmDialogService,
    private readonly router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super(confirmDialog);
    activatedRoute.data
      .pipe(map((data) => data.gitlabPage.items))
      .subscribe((gitlab: GitlabDTO[]) => (this.gitlabList = gitlab));
    this.columnDefs = [
      //new ColumnDef('id', 'Id', false, false, false),
      new ColumnDef('code', 'Code', true, true, false, FilterType.TEXT),
      new ColumnDef('name', 'Name', false),
      new ColumnDef('managed_gitlab_server', 'Is Gitlab server managed?', false),
      new ColumnDef('description', 'Description', false),
      new ColumnDef('runners', 'Runners', false),
    ];
  }

  getDatas(httpParams: HttpParams): Observable<any> {
    const newFilter = JSON.parse(httpParams.get('filter'));
    const newHttpParams = new HttpParams()
      .set('filter', JSON.stringify(newFilter))
      .set('page', httpParams.get('page'))
      .set('limit', httpParams.get('limit'))
      .set('sort', httpParams.get('sort'));
    return this.gitlabService.get(newHttpParams);
  }

  onDataChanged(gitlab: any) {
    this.gitlabList = gitlab as GitlabDTO[];
  }

  onAddGitlab() {
    this.router.navigate(['/build/gitlab/new'], {
      queryParamsHandling: 'preserve',
    });
  }

  onDeleteSelected(selection: any[]): Observable<any> {
    return Observable.create((observer: Observer<any>) => {});
  }
  delete(gitlabDTO: GitlabDTO): Observable<any> {
    return this.gitlabService.delete(gitlabDTO.id);
  }

  entityCanEdit = (gitlabDTO: GitlabDTO) => true;
  entityCanDelete = (gitlabDTO: GitlabDTO) => true;

  entityEdit(gitlabDTO: GitlabDTO) {}
}
