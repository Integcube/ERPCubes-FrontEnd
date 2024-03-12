import { ChangeDetectorRef, Component } from '@angular/core';
import { WidgetService } from '../../widget.service';


@Component({
  selector: 'lost-leads',
  templateUrl: './lost-leads.component.html',
})
export class LostLeadComponent {
  totalLostLeads: any; 
  todaylost: any;
  constructor(
    private _widgetService: WidgetService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchTotalLeads();
    this.lostToday();
  }

  fetchTotalLeads() {
    this._widgetService.getLostLead().subscribe(
      (data) => {
        this.totalLostLeads = data.totalLostLeads;
        this._changeDetectorRef.detectChanges();
      },
      (error) => {
      }
    );
  }
  applyFilter(daysAgo: number) {
    this._widgetService.getLostCountFilter(daysAgo).subscribe(
      (data) => {
        this.totalLostLeads = data.totalLostLeads;
        this._changeDetectorRef.detectChanges();
      },
      (error) => {
        // Handle error if needed
      }
    );
  }
  lostToday() {
    this._widgetService.getTodayLost().subscribe(
      (data) => {
        this.todaylost = data.totalLostLeads;
        this._changeDetectorRef.detectChanges();
      },
      (error) => {
        // Handle error if needed
      }
    );
  }
}




