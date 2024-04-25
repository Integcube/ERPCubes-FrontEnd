import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject, combineLatest, map } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UntypedFormControl } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LeadOwnerReport, LeadSource, LeadStatus } from './leadowner-report.type';
import { LeadOwnerReportService } from './leadowner-report.service';

@Component({
  selector: 'app-leadowner-report',
  templateUrl: './leadowner-report.component.html',
  styleUrls: ['./leadowner-report.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeadOwnerReportComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('exporter') public exporter;
  leadOwner:string
  statusId:number
  sourceId:number
  //currentDate = new Date();
  startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 2);
  endDate = new Date(new Date().getFullYear(),new Date().getMonth()+1,1); 
  dataSource: MatTableDataSource<LeadOwnerReport>;
  displayedColumns: string[] = [ 'leadOwnerName', 'totalLeads', 'totalRevenue', 'averageDealSize', 'convertedleads', 'conversionRate', 'winLeads', 'winRates'];
  selection = new SelectionModel<LeadOwnerReport>(true, []);
  leadOwnerReportCount: number = 0;
  totalLeadOwner: number = 0;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  

  _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    private _leadOwnerReportService: LeadOwnerReportService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }
  usernames$ = this._leadOwnerReportService.users$
  source$ = this._leadOwnerReportService.sourec$
  status$=this._leadOwnerReportService.statesus$
  usersList : any[] =[];
  leadOwnerReportWithUser$ =this._leadOwnerReportService.leadOwnerReport$
  sources: LeadSource[] = [];
  statuses: LeadStatus[]=[];
  
  ngOnInit(): void {
     this.sourceId = -1;
     this.statusId=-1;
     this.leadOwner="-1";
     this.leadOwnerReportWithUser$.subscribe((report) => {
        this.leadOwnerReportCount = report.length;
        this.dataSource = new MatTableDataSource(report);    
        this.ngAfterViewInit();
        this._changeDetectorRef.markForCheck();
        
    });
    this.source$.subscribe(
      data=>{this.sources = [...data] }
    );
    this.status$.subscribe(
      data=>{this.statuses = [...data] }
    );
    this._leadOwnerReportService.usersList$.subscribe(
      data=>{this.usersList= [...data]}
    )
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnDestroy(): void {
  
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }


  getLeadOwnerReports(){
    this._leadOwnerReportService.getLeadOwnerReport(this.startDate.toISOString(), this.endDate.toISOString(), this.sourceId, this.statusId, this.leadOwner).subscribe();
  }
}
