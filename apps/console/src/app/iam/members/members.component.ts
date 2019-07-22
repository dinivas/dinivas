import { FilterType } from './../../core/entity/filter-bar/filter';
import { ColumnDef } from './../../core/entity/mat-crud/column-def';
import { Observable, Observer } from 'rxjs/';
import { ConfirmDialogService } from './../../core/dialog/confirm-dialog/confirm-dialog.service';
import { MatDialog } from '@angular/material';
import { DataProvider } from './../../core/entity/mat-crud/data-provider';
import { MatCrudComponent } from './../../core/entity/mat-crud/mat-crud.component';
import { HttpParams } from '@angular/common/http';
import { IamService } from './../../shared/iam/iam.service';
import { Component } from '@angular/core';
import { UserRepresentation } from '@dinivas/dto';

@Component({
  selector: 'dinivas-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent extends MatCrudComponent
  implements DataProvider<UserRepresentation> {
  filterPlaceholder = 'Filter';
  dataProvider = this;
  deleteConfirmQuestion: Function = entity => `Delete member ${entity.username} ?`;

  columnDefs: Array<ColumnDef>;

  constructor(
    public dialog: MatDialog,
    private iamService: IamService,
    public confirmDialog: ConfirmDialogService
  ) {
    super(confirmDialog);
    this.columnDefs = [
      new ColumnDef('id', 'Id', true, false, false, FilterType.TEXT),
      new ColumnDef('username', 'User Name', true, true, false, FilterType.TEXT),
      new ColumnDef('email', 'Email', false, false, false),
      new ColumnDef('firstName', 'First Name', true, true, false, FilterType.TEXT),
      new ColumnDef('lastName', 'Last Name', true, true, false, FilterType.TEXT),
    ];
  }

  getDatas(httpParams: HttpParams): Observable<any> {
    const newFilter = JSON.parse(httpParams.get('filter'));
    const newHttpParams = new HttpParams()
      .set('filter', JSON.stringify(newFilter))
      .set('page', httpParams.get('page'))
      .set('limit', httpParams.get('limit'))
      .set('sort', httpParams.get('sort'));
    return this.iamService.getAllUsers(new HttpParams());
  }

  deleteSelected(selection: any[]): Observable<any> {
    return Observable.create((observer: Observer<any>) => {});
  }

  delete(userRepresentation: UserRepresentation): Observable<any> {
    return null;
  }

  entityCanEdit = (userRepresentation: UserRepresentation) => true;
}
