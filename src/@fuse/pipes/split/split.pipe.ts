import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'Split',
})
export class SplitPipe implements PipeTransform {
  transform(value: string | undefined, separator: string = ','): string[] {
    return value ? value.split(separator) : [];
  }
}
