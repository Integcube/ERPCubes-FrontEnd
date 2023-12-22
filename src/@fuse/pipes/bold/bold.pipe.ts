// bold.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'bold',
    pure: false
})
export class BoldPipe implements PipeTransform {
  transform(value: string): string {
    return `<strong>${value}</strong>`;
  }
}
