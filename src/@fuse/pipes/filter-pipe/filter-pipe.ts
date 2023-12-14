import { Pipe, PipeTransform } from '@angular/core';
import { LeadReport } from 'app/modules/admin/crm/lead-report/lead-report.type';

/**
 * Finds an object from given source using the given key - value pairs
 */
@Pipe({
    name: 'filterx',
    pure: false
})
export class CustomFilterPipe implements PipeTransform {
    transform(items: LeadReport[], searchTerm: number): LeadReport[] {
      if (!items || !searchTerm) {
        return items; 
      }
    let c = items.filter(item => item.prodId === searchTerm);
      return c
    }
  }


  @Pipe({
    name: 'filterxy',
    pure: false
})
export class CustomFilterPipe2 implements PipeTransform {
    transform(items: LeadReport[], searchTerm: number): LeadReport[] {
      if (!items || !searchTerm) {
        return items; 
      }
    let c = items.filter(item => item.sId === searchTerm);
      return c
    }
  }