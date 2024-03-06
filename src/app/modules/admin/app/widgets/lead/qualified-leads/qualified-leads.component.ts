import { ChangeDetectorRef, Component } from '@angular/core';
import { WidgetService } from '../../widget.service';


@Component({
  selector: 'qualified-leads',
  templateUrl: './qualified-leads.component.html',
})
export class QualifiedLeadComponent {
  totalQualifiedLeads: any; 

  constructor(
    private _widgetService: WidgetService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchTotalLeads();
  }

  fetchTotalLeads() {
    this._widgetService.getQualifiedLead().subscribe(
      (data) => {
        debugger;
        this.totalQualifiedLeads = data.totalQualifiedLeads;
        this._changeDetectorRef.detectChanges();
      },
      (error) => {
      }
    );
  }
}




