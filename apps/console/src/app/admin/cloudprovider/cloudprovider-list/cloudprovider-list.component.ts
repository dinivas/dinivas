import { CloudproviderDialogComponent } from './../cloudprovider-dialog/cloudprovider-dialog.component';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTable, MatDialog } from '@angular/material';
import { ListDataSource, ListItem } from './cloudprovider-list-datasource';

@Component({
  selector: 'dinivas-cloudprovider-list',
  templateUrl: './cloudprovider-list.component.html',
  styleUrls: ['./cloudprovider-list.component.scss']
})
export class CloudproviderListComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatTable, { static: false }) table: MatTable<ListItem>;
  dataSource: ListDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name'];

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.dataSource = new ListDataSource();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  addCloudProvider() {
    const addEntityDialogRef = this.dialog.open(
      CloudproviderDialogComponent,
      {
        width: '600px',
      }
    );

    addEntityDialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.refreshDatas();
        }
      },
      err => console.log(err)
    );
  }
  refreshDatas() {
    throw new Error('Method not implemented.');
  }
}
