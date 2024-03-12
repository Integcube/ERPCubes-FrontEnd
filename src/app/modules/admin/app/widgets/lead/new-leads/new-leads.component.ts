import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { WidgetService } from '../../widget.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'new-leads',
  templateUrl: './new-leads.component.html',
})
export class NewLeadsComponent {
  totalNewLeads: any; 
  todayNew: any;
  constructor(
    private _widgetService: WidgetService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchTotalLeads();
    this.newToday();
  }

  fetchTotalLeads() {
    this._widgetService.getNewLead().subscribe(
      (data) => {
        this.totalNewLeads = data.totalNewLeads;
        this._changeDetectorRef.detectChanges();
      },
      (error) => {
      }
    );
  }
  applyFilter(daysAgo: number) {
    this._widgetService.getNewCountFilter(daysAgo).subscribe(
      (data) => {
        this.totalNewLeads = data.totalNewLeads;
        this._changeDetectorRef.detectChanges();
      },
      (error) => {
        // Handle error if needed
      }
    );
  }
  newToday() {
    this._widgetService.getTodayNew().subscribe(
      (data) => {
        this.todayNew = data.totalNewLeads;
        this._changeDetectorRef.detectChanges();
      },
      (error) => {
        // Handle error if needed
      }
    );
  }
}
