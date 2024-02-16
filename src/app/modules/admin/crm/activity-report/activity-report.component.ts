import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ActivityReportService } from './activity-report.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject, combineLatest, map } from 'rxjs';
import { ActivityReport,Filter } from './activity-report.type';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { UntypedFormControl } from '@angular/forms';
@Component({
  selector: 'app-activity-report',
  templateUrl: './activity-report.component.html',
  styleUrls: ['./activity-report.component.scss'],
})
export class ActivityReportComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('exporter') public exporter;
  leadPipelineFilter: Filter = new Filter({});
  dataSource: MatTableDataSource<ActivityReport>;
  displayedColumns: string[] = [ 'leadOwnerName', 'lead', 'note', 'call', 'email', 'task', 'meeting']; 
  selection = new SelectionModel<ActivityReport>(true, []);
  activityReportCount: number = 0;
  totalActivities: number = 0;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  
 

  _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    private _activityReportService: ActivityReportService,
    private _changeDetectorRef: ChangeDetectorRef
  ) { }
  usernames$ = this._activityReportService.users$
  reports$ = this._activityReportService.activityReport$
  activityReportWithUser$ = this.reports$;
  
  products$ = this._activityReportService.prodcts$
  project$ = this._activityReportService.project$;
  leadStatuses$ = this._activityReportService.leadStatus$;


  ngOnInit(): void {
    this.activityReportWithUser$.subscribe((report) => {
        this.activityReportCount = report.length;
        this.dataSource = new MatTableDataSource(report);
        this.ngAfterViewInit();
        this._changeDetectorRef.markForCheck();
    });
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
    this._activityReportService.getActivityReport(this.leadPipelineFilter).subscribe();
  }

}
