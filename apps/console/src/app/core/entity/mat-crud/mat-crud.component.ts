import {
  OnInit,
  ViewContainerRef,
  Input,
  Type,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild
} from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import {
  Filter,
  FilterType,
  FilterArray,
  FilterText
} from '../filter-bar/filter';
import { DataProvider } from './data-provider';
import { ColumnDef } from './column-def';
import { SelectionModel } from '@angular/cdk/collections';
import { ConfirmDialogService } from '../../dialog/confirm-dialog/confirm-dialog.service';
import { HttpParams } from '@angular/common/http';
import { switchMap, delay, startWith, map, catchError } from 'rxjs/operators';
import { merge, of } from 'rxjs';


export class MatCrudComponent implements OnInit {
  @ViewChild('tableDataViewChild', { read: ViewContainerRef, static: true })
  _container: ViewContainerRef;
  @Input() parentViewContainerRef: ViewContainerRef;

  @Input() tableDataInputComponent: Type<any>;

  displayedColumns = ['select'];

  dataSource = new MatTableDataSource();

  selection = new SelectionModel<any>(true, []);

  isLoadingResults = false;

  filters: Filter[] = [];

  @ViewChild(MatPaginator ,{ static: true }) paginator: MatPaginator;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild('filterInput', { static: true }) filterInput: ElementRef;

  @Input() public dataProvider: DataProvider<any>;
  @Input() public showAddButton = true;

  totalEntitiesCount: number;

  @Input() public entityName: string;
  @Input() public deleteConfirmQuestion: Function = () =>
    'Voulez vous vraiment supprimer la selection ?';
  @Input() public entityDelete: boolean = true;

  @Input() public entityCanEdit: Function = () => true;
  @Input() public entityCanDelete: Function = () => true;
  @Input() public entityCanApprove: Function = () => false;
  @Input() public entityCanReject: Function = () => false;

  @Input() public pageSize: number = 20;

  @Input() public pageSizeOptions = [10, 20, 50];

  @Input() public filterPlaceholder: string;

  @Input() public columnDefs: Array<ColumnDef>;

  @Input() public entityDialogComponent: any;

  @Output() onAddEntity: EventEmitter<any> = new EventEmitter();

  @Output() onRefreshData: EventEmitter<any>;

  @Output() onDeleteSelection: EventEmitter<any>;

  @Output() onEditEntity: EventEmitter<any> = new EventEmitter();

  @Output() onApprovetEntity: EventEmitter<any> = new EventEmitter();

  @Output() onRejectEntity: EventEmitter<any> = new EventEmitter();

  constructor(
    public confirmDialog: ConfirmDialogService
  ) {}

  ngOnInit() {
    this.initDisplayedColumns();
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.refreshDatas();
  }

  refreshDatas() {
    if (this.onRefreshData != undefined) {
      this.onRefreshData.emit();
    } else {
      merge(this.sort.sortChange, this.paginator.page)
        .pipe(
          startWith({}),
          delay(0),
          switchMap(() => {
            this.isLoadingResults = true;
            let httpParams = new HttpParams();
            httpParams = httpParams.append(
              'page',
              this.paginator.pageIndex.toString()
            );
            httpParams = httpParams.append(
              'size',
              this.paginator.pageSize.toString()
            );
            httpParams = httpParams.append(
              'sort',
              this.sort.active + ',' + this.sort.direction
            );
            httpParams = httpParams.append(
              'filter',
              JSON.stringify({ filter: Filter.toHttpParam(this.filters) })
            );
            //this.filterInput.nativeElement.value
            return this.dataProvider.getDatas(httpParams);
          }),
          map(data => {
            // Flip flag to show that loading has finished.
            this.selection.clear();
            this.isLoadingResults = false;
            this.totalEntitiesCount = data.totalCount;
            return data.result;
          }),
          catchError(() => {
            this.selection.clear();
            this.isLoadingResults = false;
            return of([]);
          })
        )
        .subscribe(data => {
          this.dataSource.data = data;
        });
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isRowSelected(row) {
    return this.selection.isSelected(row);
  }

  addEntity(event: any) {
    this.onAddEntity.emit(event);
  }

  deleteSelection() {
    if (this.onDeleteSelection != undefined) {
      this.onDeleteSelection.emit();
    } else {
      this.dataProvider
        .deleteSelected(this.selection.selected)
        .subscribe(response => {
          this.refreshDatas();
        });
    }
  }

  deleteEntity(entity) {
    this.confirmDialog.doOnConfirm(this.deleteConfirmQuestion(entity), () => {
      return this.dataProvider.delete(entity).subscribe(response => {
        this.refreshDatas();
      });
    });
  }

  filterChanged(filter: Filter) {
    this.refreshDatas();
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  selectFilter(filter: Filter) {
    filter.selected = true;
  }

  initDisplayedColumns() {
    this.columnDefs.forEach(col => {
      this.displayedColumns.push(col.id);
      if (col.filter) {
        switch (col.filterType) {
          case FilterType.ARRAY: {
            this.filters.push(
              new FilterArray(
                col.id,
                col.label,
                col.filterType,
                col.filterSelected,
                col.filterRemovable,
                col.filterDatas
              )
            );
            break;
          }
          default: {
            this.filters.push(
              new FilterText(
                col.id,
                col.label,
                col.filterType,
                col.filterSelected,
                col.filterRemovable
              )
            );
            break;
          }
        }
      }
    });
    this.displayedColumns.push('row-actions');
  }
}
