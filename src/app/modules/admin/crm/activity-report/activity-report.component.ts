import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ActivityReportService } from './activity-report.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject, combineLatest, map } from 'rxjs';
import { ActivityReport } from './activity-report.type';
import { Router } from '@angular/router';
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

  dataSource: MatTableDataSource<ActivityReport>;
  displayedColumns: string[] = [ 'select', 'leadOwnerName', 'lead', 'note', 'call', 'email', 'task', 'meeting'];
  selection = new SelectionModel<ActivityReport>(true, []);
  activityReportCount: number = 0;

  searchInputControl: UntypedFormControl = new UntypedFormControl();
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    //_unsubscribeAll: Subject<any> = new Subject<any>(),
    private _activityReportService: ActivityReportService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
  ) { }
  
  usernames$ = this._activityReportService.users$
  reports$ = this._activityReportService.activityReport$
  activityReportWithUser$ = combineLatest(
    this.usernames$,
    this.reports$,
  ).pipe(
    map(([users, reports]) => reports.map(r => ({
      ...r,
      leadOwnerName: users.find(a => a.id === r.leadOwner)?.name
    } as ActivityReport)))
  )
  ngOnInit(): void {
    this.activityReportWithUser$.subscribe((report) => {
        this.activityReportCount = report.length;
        this.dataSource = new MatTableDataSource(report);
        console.log('DataSource:', this.dataSource.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this._changeDetectorRef.markForCheck();
    });
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
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  checkboxLabel(row?: ActivityReport): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.leadOwner + 1}`;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  trackByFn(index: number, item: any): any {
      return item.id || index;
  }
}
