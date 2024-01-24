import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false
})

export class FilterPipe implements PipeTransform {
  transform(items: any[], filter: any, exactMatch: boolean = true): any[] {
    if (!items || !filter) {
      return items;
    }
    return items.filter((item) => {
      for (const key in filter) {
        if (filter.hasOwnProperty(key)) {
          const filterValue = filter[key].toString().toLowerCase();
          const itemValue = item[key].toString().toLowerCase();

          if (exactMatch) {
            if (itemValue !== filterValue) {
              return false;
            }
          } else {
            if (!itemValue.includes(filterValue)) {
              return false;
            }
          }
        }
      }
      return true;
    });
  }
}
