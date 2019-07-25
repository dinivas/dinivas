import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { Filter } from './filter';

@Component({
  selector: 'dinivas-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss']
})
export class FilterBarComponent implements OnInit {

  @Input() public filterPlaceholder: string;
  @Input() selection = new SelectionModel<any>(true, []);
  @Input() public showAddButton = true;
  @Input() public addButtonLabel = 'Add';
  @Input() filters: Filter[] = [];

  @Output() onFilterChanged: EventEmitter<any> = new EventEmitter;
  @Output() onRefreshData: EventEmitter<any> = new EventEmitter;
  @Output() onAddEntity: EventEmitter<any> = new EventEmitter();
  @Output() onDeleteSelection: EventEmitter<any> = new EventEmitter();

  globalFilterText: string = '';

  constructor() { }

  ngOnInit() {
  }

  addEntity(event: any) {
    this.onAddEntity.emit(event);
  }

  refreshDatas(event){
    this.onRefreshData.emit(event);
  }

  deleteSelection(event){
    this.onDeleteSelection.emit(event);
  }
  filterChanged(event){
    this.onFilterChanged.emit(event);
  }
}
