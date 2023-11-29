import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tblimit',
})
export class TableLimitPipe implements PipeTransform {
  transform(value: string, isHover:boolean): string {
    let limit = 27;
    if (!value){
        return '';
    } 
    if (isHover){
        limit = 15
        return value.length > limit ? value.substring(0, limit) + '...' : value;

    }
    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }
}