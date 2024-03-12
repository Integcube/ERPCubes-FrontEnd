import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { WidgetService } from '../../widget.service';
import { TotalLeadCount } from '../../widget.type';

@Component({
  selector: 'total-leads',
  templateUrl: './total-leads.component.html',
})
export class TotalLeadsComponent implements OnInit {
  totalLeads: any; 
  todayNew: any; 

  constructor(
    private _widgetService: WidgetService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchTotalLeads();
    this.todayLeads();
  }

  fetchTotalLeads() {
    this._widgetService.getTotalLead().subscribe(
      (data) => {
        this.totalLeads = data.totalLeads;
        this._changeDetectorRef.detectChanges();
      },
      (error) => {
      }
    );
  }
  applyFilter(daysAgo: number) {
    this._widgetService.getTotalCountFilter(daysAgo).subscribe(
      (data) => {
        this.totalLeads = data.totalLeads;
        this._changeDetectorRef.detectChanges();
      },
      (error) => {
        // Handle error if needed
      }
    );
  }
  todayLeads() {
    this._widgetService.getTodayNew().subscribe(
      (data) => {
        this.todayNew = data.totalNewLeads;
        this._changeDetectorRef.detectChanges();
      },
      (error) => {
      }
    );
  }
}
