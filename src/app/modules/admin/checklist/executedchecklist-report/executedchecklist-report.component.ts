import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { ExecutedChecklistReport } from './executedchecklist-report.type';
import { ExecutedChecklistReportService } from './executedchecklist-report.service';

@Component({
  selector: 'executedchecklist-report',
  templateUrl: './executedchecklist-report.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExecutedChecklistReportComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('exporter') public exporter;

  dataSource: MatTableDataSource<ExecutedChecklistReport>;
  displayedColumns: string[] = [ 'firstName', 'totalCheckpoints','executedCheckpoints', 'notExecutedCheckpoints', 'overdueCheckpoints','executedPercentage','action'];
  checklistReportCount: number = 0;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 2);
  endDate = new Date(new Date().getFullYear(),new Date().getMonth()+1,1); 

  _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    private _checklistReportService: ExecutedChecklistReportService,
    private _changeDetectorRef: ChangeDetectorRef,
    
  ) { }
  reports$ = this._checklistReportService.checklistReport$
  checklistReportWithUser$ = this.reports$;
  


  ngOnInit(): void {
    this.dataSource = new MatTableDataSource([]);
    this.checklistReportWithUser$.subscribe((report) => {
      if (report) {
        this.checklistReportCount = report.length;
        this.dataSource.data = report; 
        this._changeDetectorRef.markForCheck();
    }

        this.ngAfterViewInit();
    
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
    this._checklistReportService.getCheckListReport(this.startDate.toISOString(), this.endDate.toISOString()).subscribe();
  }
}
  
