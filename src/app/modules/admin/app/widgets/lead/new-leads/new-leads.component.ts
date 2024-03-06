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

  constructor(
    private _widgetService: WidgetService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchTotalLeads();
  }

  fetchTotalLeads() {
    this._widgetService.getNewLead().subscribe(
      (data) => {
        debugger;
        this.totalNewLeads = data.totalNewLeads;
        this._changeDetectorRef.detectChanges();
      },
      (error) => {
      }
    );
  }
}
