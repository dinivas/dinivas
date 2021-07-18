import { ContextualMenuService } from './../../../core/contextual-menu/contextual-menu.service';
import { AdminIamService } from './../../../shared/admin-iam/admin-iam.service';
import { FilterType } from './../../../core/entity/filter-bar/filter';
import { ConfirmDialogService } from './../../../core/dialog/confirm-dialog/confirm-dialog.service';
import { ColumnDef } from './../../../core/entity/mat-crud/column-def';
import { MatCrudComponent } from './../../../core/entity/mat-crud/mat-crud.component';

import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { UserRepresentation } from '@dinivas/api-interfaces';
import { DataProvider } from '../../../core/entity/mat-crud/data-provider';
import { AdminIAMMemberEditComponent } from './member-edit/member-edit.component';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'dinivas-admin-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
})
export class AdminIAMMemberComponent
  extends MatCrudComponent
  implements DataProvider<UserRepresentation>
{
  filterPlaceholder = 'Filter';
  columnDefs: Array<ColumnDef>;
  dataProvider = this;
  deleteConfirmQuestion: ({ username: string }) => string = (entity) =>
    `Delete member ${entity.username} ?`;

  constructor(
    private adminIamService: AdminIamService,
    public confirmDialog: ConfirmDialogService,
    private contextualMenuService: ContextualMenuService
  ) {
    super(confirmDialog);
    this.columnDefs = [
      new ColumnDef('id', 'Id', true, false, false, FilterType.TEXT),
      new ColumnDef(
        'username',
        'User Name',
        true,
        true,
        false,
        FilterType.TEXT
      ),
      new ColumnDef('email', 'Email', false, false, false),
      new ColumnDef(
        'firstName',
        'First Name',
        true,
        true,
        false,
        FilterType.TEXT
      ),
      new ColumnDef(
        'lastName',
        'Last Name',
        true,
        true,
        false,
        FilterType.TEXT
      ),
    ];
  }

  getDatas(httpParams: HttpParams): Observable<any> {
    const newFilter = JSON.parse(httpParams.get('filter'));
    const newHttpParams = new HttpParams()
      .set('filter', JSON.stringify(newFilter))
      .set('page', httpParams.get('page'))
      .set('limit', httpParams.get('limit'))
      .set('sort', httpParams.get('sort'));
    return this.adminIamService.getAllUsers(new HttpParams());
  }

  deleteSelected(selection: any[]): Observable<any> {
    return Observable.create((observer: Observer<any>) => {});
  }

  delete(userRepresentation: UserRepresentation): Observable<any> {
    return null;
  }

  addMember() {}
  editMember(userRepresentation: UserRepresentation) {
    this.contextualMenuService.openComponentInContextualMenu(
      AdminIAMMemberEditComponent,
      userRepresentation
    );
  }
}
