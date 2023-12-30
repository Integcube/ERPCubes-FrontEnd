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
  leadOwner:string
  statusId:number
  sourceId:number
  startDate: Date
  endDate: Date
  dataSource: MatTableDataSource<LeadOwnerReport>;
  displayedColumns: string[] = [ 'leadOwner', 'totalLeads', 'totalRevenue', 'averageDealSize', 'winLeads', 'winRates', 'convertedleads', 'conversionRate'];
  selection = new SelectionModel<LeadOwnerReport>(true, []);
  leadOwnerReportCount: number = 0;
  totalLeadOwner: number = 0;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    private _leadOwnerReportService: LeadOwnerReportService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }
  usernames$ = this._leadOwnerReportService.users$
  source$ = this._leadOwnerReportService.sourec$
  status$=this._leadOwnerReportService.statesus$
  reports$ = this._leadOwnerReportService.leadOwnerReport$
  usersList : any[] =[];
  leadOwnerReportWithUser$ = combineLatest(
    this.usernames$,
    this.reports$,
  ).pipe(
    map(([users, reports]) => reports.map(r => ({
      ...r,
      leadOwnerName: users.find(a => a.id === r.leadOwner)?.name
    } as LeadOwnerReport)))
  )
  sources: LeadSource[] = [];
  statuses: LeadStatus[]=[];
  
  ngOnInit(): void {
     this.sourceId = -1;
     this.statusId=-1;
     this.leadOwner="-1";
     this.leadOwnerReportWithUser$.subscribe((report) => {
        this.leadOwnerReportCount = report.length;
        this.dataSource = new MatTableDataSource(report);
        const currentDate = new Date();
            this.startDate = new Date(currentDate.setDate(currentDate.getDate() - 30));
        const endingDate = new Date();
            this.endDate = new Date(endingDate.setDate(endingDate.getDate() + 30));    
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
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  // toggleAllRows() {
  //   if (this.isAllSelected()) {
  //     this.selection.clear();
  //     return;
  //   }
  //   this.selection.select(...this.dataSource.data);
  // }
  // isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.dataSource.data.length;
  //   return numSelected === numRows;
  // }
  // checkboxLabel(row?: LeadOwnerReport): string {
  //   if (!row) {
  //     return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
  //   }
  //   return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.leadOwner + 1}`;
  // }
  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }

  getLeadOwnerReports(){
    debugger;
    this._leadOwnerReportService.getLeadOwnerReport(this.startDate.toISOString(), this.endDate.toISOString(), this.sourceId, this.statusId, this.leadOwner).subscribe();
  }
}
