import { ChangeDetectorRef, Component } from '@angular/core';
import { WidgetService } from '../../widget.service';


@Component({
  selector: 'won-leads',
  templateUrl: './won-leads.component.html',
})
export class WonLeadComponent {
    totalWonLeads: any; 
    todayWon: any;
    constructor(
      private _widgetService: WidgetService,
      private _changeDetectorRef: ChangeDetectorRef
    ) {}
  
    ngOnInit() {
      this.fetchTotalLeads();
      this.wonToday();
    }
  
    fetchTotalLeads() {
      this._widgetService.getWonLead().subscribe(
        (data) => {
          this.totalWonLeads = data.totalWonLeads;
          this._changeDetectorRef.detectChanges();
        },
        (error) => {
        }
      );
    }
    applyFilter(daysAgo: number) {
      this._widgetService.getWonCountFilter(daysAgo).subscribe(
        (data) => {
          this.totalWonLeads = data.totalWonLeads;
          this._changeDetectorRef.detectChanges();
        },
        (error) => {
          // Handle error if needed
        }
      );
    }
    wonToday() {
      this._widgetService.getTodayWon().subscribe(
        (data) => {
          this.todayWon = data.totalWonLeads;
          this._changeDetectorRef.detectChanges();
        },
        (error) => {
          // Handle error if needed
        }
      );
    }
}




