import { Pipe, PipeTransform } from '@angular/core';
import { LeadReport } from 'app/modules/admin/crm/lead-report/lead-report.type';
import * as _ from 'lodash';
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
        return c;
    }
}
