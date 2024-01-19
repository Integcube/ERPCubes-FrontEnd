import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy',
  pure: false, 
})
export class OrderByPipe implements PipeTransform {
  transform(items: any[], property: string): any[] {
    if (!items || !property) {
      return items;
    }

    return items.sort((a, b) => {
      const valueA = a[property];
      const valueB = b[property];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return valueA.localeCompare(valueB);
      } else {
        return valueA - valueB;
      }
    });
  }
}
