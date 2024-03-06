import { ChangeDetectorRef, Component } from '@angular/core';
import { WidgetService } from '../../widget.service';


@Component({
  selector: 'lost-leads',
  templateUrl: './lost-leads.component.html',
})
export class LostLeadComponent {
  totalLostLeads: any; 

  constructor(
    private _widgetService: WidgetService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchTotalLeads();
  }

  fetchTotalLeads() {
    this._widgetService.getLostLead().subscribe(
      (data) => {
        debugger;
        this.totalLostLeads = data.totalLostLeads;
        this._changeDetectorRef.detectChanges();
      },
      (error) => {
      }
    );
  }
}




