import { LeadReport, LeadStatus, Product ,LeadSource,LeadPipelineFilter } from "./campaig-effectiveness.type";
import { ChangeDetectorRef, Component, Inject, ViewChild, OnInit, ChangeDetectionStrategy, OnDestroy, AfterViewInit, ElementRef, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subject, combineLatest, map } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CampaigEffectivenessService } from "./campaig-effectiveness.service";
@Component({
  selector: 'app-lead-Pipeline',
  templateUrl: './campaig-effectiveness.component.html',
  styleUrls: ['./campaig-effectiveness.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CampaigEffectivenessComponent implements OnInit, OnDestroy {

  dataSource: MatTableDataSource<LeadReport>;
  displayedColumns: string[] = [ 'campaignTitle', 'source', 'totalLeads', 'convertedLeads', 'conversionRate','winLeads' ,'winRate', 'totalCost','costperLead','revenueGenerated','returnonInvestment'];
  constructor(
    private _leadPipelineService: CampaigEffectivenessService,
    private _changeDetectorRef: ChangeDetectorRef
  ) { }

  leadPipelineFilter: LeadPipelineFilter = new LeadPipelineFilter({});
  leadReportCount: number = 0;
  _unsubscribeAll: Subject<any> = new Subject<any>();
  users$ = this._leadPipelineService.users$
  leadStatuses$ = this._leadPipelineService.leadStatus$
  products$ = this._leadPipelineService.prodcts$
  leadSources$ = this._leadPipelineService.leadSource$;
  leadReport$ = this._leadPipelineService.leadReport$;

  getLeadReports(){
    this._leadPipelineService.getLeadReport(this.leadPipelineFilter).subscribe();
  }

  ngOnInit(): void {
    this.leadReport$.subscribe((report) => {
      //this.activityReportCount = report.length;
      this.dataSource = new MatTableDataSource(report);
      // this.ngAfterViewInit();
      this._changeDetectorRef.markForCheck();
  });
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }


}