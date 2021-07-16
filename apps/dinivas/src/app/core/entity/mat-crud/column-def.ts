import { FilterType } from './../filter-bar/filter';
import { PipeTransform } from '@angular/core';

export class ColumnDef {
  constructor(
    public id: string,
    public label: string,
    public filter: boolean = true,
    public filterSelected?: boolean,
    public filterRemovable?: boolean,
    public filterType?: FilterType,
    public filterDatas?: any
  ) {}
}

export class PipeTransformSpec {
  constructor(public pipe: PipeTransform, public args: any[]) {}
}
