import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monthToWord'
})
export class MonthToWordPipe implements PipeTransform {
  transform(month: number): string {
    const monthsArray = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    if (month >= 1 && month <= 12) {
      return monthsArray[month - 1];
    } else {
      return 'Invalid Month';
    }
  }
}