import {  Component, OnInit } from '@angular/core';
import { WidgetService } from '../../widget.service';
import { Filter } from '../../widget.type';
import {  StatusEnum } from 'app/core/enum/crmEnum';

@Component({
  selector: 'total-leads',
  templateUrl: './total-leads.component.html',
})
export class TotalLeadsComponent implements OnInit {
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
    this.filter.status = this.statusEnumInstance.All;
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
