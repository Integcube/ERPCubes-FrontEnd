import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject } from 'rxjs';
import { ChecklistReporttService } from './checklist-report.service';
import { MatTableDataSource } from '@angular/material/table';
import { ChecklistReport } from './checklist-report.type';

@Component({
  selector: 'checklist-report',
  templateUrl: './checklist-report.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChecklistReportComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('exporter') public exporter;

  dataSource: MatTableDataSource<ChecklistReport>;
  displayedColumns: string[] = [ 'referenceno', 'title', 'total', 'executedCount', 'notExecutedCount', 'executedPercentage'];
  checklistReportCount: number = 0;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  

  _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    private _checklistReportService: ChecklistReporttService,
    private _changeDetectorRef: ChangeDetectorRef,
    
  ) { }
  reports$ = this._checklistReportService.checklistReport$
  checklistReportWithUser$ = this.reports$;
  
  // products$ = this._activityReportService.prodcts$
  // project$ = this._activityReportService.project$;
  // leadStatuses$ = this._activityReportService.leadStatus$;


  ngOnInit(): void {
    this.checklistReportWithUser$.subscribe((report) => {
        this.checklistReportCount = report.length;
        this.dataSource = new MatTableDataSource(report);
        this.ngAfterViewInit();
        this._changeDetectorRef.markForCheck();
    });
    this.getLeadReports();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  getLeadReports(){
    this._checklistReportService.getCheckListReport().subscribe();
  }

  }
  
