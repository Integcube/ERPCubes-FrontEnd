import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Lead } from '../../widget.type';
import { WidgetService } from '../../widget.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'total-leads',
  templateUrl: './total-leads.component.html',
})
export class TotalLeadsComponent implements OnInit {
  filterLeads: Lead[] = [];
  leads: Lead[] = [];
  drawerOpened: boolean = false;

  private unsubscribe$: Subject<void> = new Subject();

  constructor(
    private _widgetService: WidgetService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this._widgetService.leads$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((leads) => {
        this.leads = leads || [];
        // this.updateData();
      });

    this._widgetService.getLeads();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


}
