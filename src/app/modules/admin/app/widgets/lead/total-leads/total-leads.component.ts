import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { WidgetService } from '../../widget.service';
import { TotalLeadCount } from '../../widget.type';

@Component({
  selector: 'total-leads',
  templateUrl: './total-leads.component.html',
})
export class TotalLeadsComponent implements OnInit {
  totalLeads: any; 

  constructor(
    private _widgetService: WidgetService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchTotalLeads();
  }

  fetchTotalLeads() {
    this._widgetService.getTotalLead().subscribe(
      (data) => {
        debugger;
        this.totalLeads = data.totalLeads;
        this._changeDetectorRef.detectChanges();
      },
      (error) => {
      }
    );
  }
}
