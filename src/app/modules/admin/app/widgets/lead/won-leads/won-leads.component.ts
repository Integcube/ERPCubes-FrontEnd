import { ChangeDetectorRef, Component } from '@angular/core';
import { WidgetService } from '../../widget.service';


@Component({
  selector: 'won-leads',
  templateUrl: './won-leads.component.html',
})
export class WonLeadComponent {
    totalWonLeads: any; 

    constructor(
      private _widgetService: WidgetService,
      private _changeDetectorRef: ChangeDetectorRef
    ) {}
  
    ngOnInit() {
      this.fetchTotalLeads();
    }
  
    fetchTotalLeads() {
      this._widgetService.getWonLead().subscribe(
        (data) => {
          debugger;
          this.totalWonLeads = data.totalWonLeads;
          this._changeDetectorRef.detectChanges();
        },
        (error) => {
        }
      );
    }
}




