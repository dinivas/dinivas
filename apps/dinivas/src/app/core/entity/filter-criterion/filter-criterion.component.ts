/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import { Filter, FilterType } from './../filter-bar/filter';

@Component({
  selector: 'dinivas-filter-criterion',
  templateUrl: './filter-criterion.component.html',
  styleUrls: ['./filter-criterion.component.scss']
})
export class FilterCriterionComponent implements OnInit {


  @Input() public filter: Filter;

  @Input() public selection = new SelectionModel<any>(true, []);

  @Output() filterChanged: EventEmitter<Filter>= new EventEmitter();

  constructor() { }

  ngOnInit() {
    
  }

  removeFilter(){
    this.filter.selected = false;
    this.filter.value = undefined;
    this.modelChanged();
  }

  modelChanged(event?: any){
    this.filterChanged.emit(this.filter)
  }
}
