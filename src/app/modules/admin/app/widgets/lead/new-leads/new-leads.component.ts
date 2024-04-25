import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { WidgetService } from '../../widget.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { StatusEnum } from 'app/core/enum/crmEnum';
import { Filter } from '../../widget.type';

@Component({
  selector: 'new-leads',
  templateUrl: './new-leads.component.html',
})
export class NewLeadsComponent {
  totalLeads: any; 
  todayNew: any; 

  filter= new Filter({});

  statusEnumInstance = new StatusEnum

  constructor(
    private _widgetService: WidgetService,

  ) {}

  ngOnInit() {
    this.fetchTotalLeads(-1);
  }

  fetchTotalLeads(days: number) {
    this.filter.days = days;
    this.filter.status = this.statusEnumInstance.New;
    this._widgetService.getTotalLead(this.filter).subscribe(
      (data) => {
        this.totalLeads = data.count;
        this.todayNew= data.newCount;

      },
      (error) => {
      }
    );
  }
 
}
