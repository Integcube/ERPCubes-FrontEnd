import { ChangeDetectorRef, Component } from '@angular/core';
import { WidgetService } from '../../widget.service';


@Component({
  selector: 'qualified-leads',
  templateUrl: './qualified-leads.component.html',
})
export class QualifiedLeadComponent {
  totalQualifiedLeads: any; 
  todayQualified: any;
  constructor(
    private _widgetService: WidgetService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchTotalLeads();
    this.qualifiedToday();
  }

  fetchTotalLeads() {
    this._widgetService.getQualifiedLead().subscribe(
      (data) => {
        this.totalQualifiedLeads = data.totalQualifiedLeads;
        this._changeDetectorRef.detectChanges();
      },
      (error) => {
      }
    );
  }
  applyFilter(daysAgo: number) {
    this._widgetService.getQualifiedCountFilter(daysAgo).subscribe(
      (data) => {
        this.totalQualifiedLeads = data.totalQualifiedLeads;
        this._changeDetectorRef.detectChanges();
      },
      (error) => {
        // Handle error if needed
      }
    );
  }
  qualifiedToday() {
    this._widgetService.getTodayQualified().subscribe(
      (data) => {
        this.todayQualified = data.totalQualifiedLeads;
        this._changeDetectorRef.detectChanges();
      },
      (error) => {
        // Handle error if needed
      }
    );
  }
}




