import { Filter } from './filter';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'selectedFilter',
  pure: false
})
export class SelectedFilterPipe implements PipeTransform {

  transform(value: Filter[], selected: boolean): Filter[] {
    const response: Filter[] =[];
    value.forEach(filter =>{
      if(filter.selected == selected){
        response.push(filter);
      }
    });
    return response;
  }

}
