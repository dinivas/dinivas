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
  @Input() customButtons: FilterBarCustomButton[] = [];
  @Output() customButtonClicked: EventEmitter<any> = new EventEmitter;

  @Output() filterChanged: EventEmitter<any> = new EventEmitter;
  @Output() refreshData: EventEmitter<any> = new EventEmitter;
  @Output() addEntity: EventEmitter<any> = new EventEmitter();
  @Output() deleteSelection: EventEmitter<any> = new EventEmitter();

  globalFilterText: string = '';

  constructor() { }

  ngOnInit() {
  }

  onAddEntity(event: any) {
    this.addEntity.emit(event);
  }

  onRefreshDatas(event){
    this.refreshData.emit(event);
  }

  onDeleteSelection(event){
    this.deleteSelection.emit(event);
  }
  onFilterChanged(event){
    this.filterChanged.emit(event);
  }

  onCustomButtonClicked(customButton: FilterBarCustomButton, event: any){
    this.customButtonClicked.emit(customButton);
  }
}

export class FilterBarCustomButton {
  matIcon: string;
  label: string;
}
