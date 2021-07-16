import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'jsonPretty'
})
export class JsonPrettyPipe implements PipeTransform {
  transform(val) {
    return JSON.stringify(val, null, 2)
      .replace(/ /g, '&nbsp;')
      .replace(/\n/g, '<br/>');
  }
}
