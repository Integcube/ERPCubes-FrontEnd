import { leadPipelineService } from './lead-pipeline.service';
import { LeadReport, LeadStatus, Product ,LeadSource,LeadPipelineFilter } from "./lead-Pipeline.type";
import { ChangeDetectorRef, Component, Inject, ViewChild, OnInit, ChangeDetectionStrategy, OnDestroy, AfterViewInit, ElementRef, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subject, combineLatest, map } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-lead-Pipeline',
  templateUrl: './lead-Pipeline.component.html',
  styleUrls: ['./lead-Pipeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeadPipelineComponent implements OnInit, OnDestroy {

  dataSource: MatTableDataSource<LeadReport>;
  displayedColumns: string[] = [ 'statusTitle', 'totalLeads', 'totalLeadValue', 'averageDealValue', 'winLeads', 'winRate', 'convertedLeads','conversionRate','expectedRevenue'];


  status: number
  statusTitle:string  
  totalLeads: number
  totalLeadValue: number
  averageDealValue: number
  winLeads: number
  winRate: number
  convertedLeads: number
  conversionRate: number
  expectedRevenue: number
  constructor(
    private _leadPipelineService: leadPipelineService,
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