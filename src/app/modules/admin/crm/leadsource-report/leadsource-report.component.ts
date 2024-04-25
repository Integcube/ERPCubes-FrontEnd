import { ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject, combineLatest, map } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UntypedFormControl } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LeadSource, LeadSourceReport } from './leadsource-report.type';
import { LeadSourceReportService } from './leadsource-report.service';
@Component({
  selector: 'app-leadsource-report',
  templateUrl: './leadsource-report.component.html',
  styleUrls: ['./leadsource-report.component.scss'],
})
export class LeadSourceReportComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('exporter') public exporter;
  sourceId:number
  startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 2);
  endDate = new Date(new Date().getFullYear(),new Date().getMonth()+1,1); 
  dataSource: MatTableDataSource<LeadSourceReport>;
  displayedColumns: string[] = [ 'source', 'totalLeads', 'convertedLeads', 'conversionRate', 'averageDealSize', 'totalRevenue'];
  selection = new SelectionModel<LeadSourceReport>(true, []);
  leadSourceReportCount: number = 0;
  totalLeadSource: number = 0;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  

  _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    private _leadSourceReportService: LeadSourceReportService,
    private _changeDetectorRef: ChangeDetectorRef,
    
  ) { }
  usernames$ = this._leadSourceReportService.users$
  source$ = this._leadSourceReportService.sourec$
  reports$ = this._leadSourceReportService.leadSourceReport$
  leadSourceReportWithUser$ = combineLatest(
    this.usernames$,
    this.reports$,
  ).pipe(
    map(([users, reports]) => reports.map(r => ({
      ...r,
      sourceName: users.find(a => a.id === r.source)?.name
    } as LeadSourceReport)))
  )
  sources: LeadSource[] = [];


  ngOnInit(): void {
     this.sourceId = -1;
    this.leadSourceReportWithUser$.subscribe((report) => {
        this.leadSourceReportCount = report.length;
        this.dataSource = new MatTableDataSource(report)
        this._changeDetectorRef.markForCheck();
    });
    this.ngAfterViewInit();
    this.source$.subscribe(
      data=>{this.sources = [...data] }
    );
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  
  getLeadSourceReports(){
    this._leadSourceReportService.getLeadSourceReport(this.startDate.toISOString(), this.endDate.toISOString(), this.sourceId).subscribe();
  }
}
