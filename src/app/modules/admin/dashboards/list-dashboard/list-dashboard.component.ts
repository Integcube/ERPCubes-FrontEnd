import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Dashboard } from './list-dashboard.type';
import { Observable, Subject, filter, fromEvent, takeUntil } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ListDashboardService } from './list-dashboard.service';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDrawer } from '@angular/material/sidenav';
import { DOCUMENT } from '@angular/common';
import { DashboardConfiguratorComponent } from './dialogs/dashboard-dialog/dashboard-configurator.component';
import { UntypedFormControl } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { DashboardBuilderDialogComponent } from './dialogs/dashboard-builder-dialog/dashboard-builder-dialog.component';

@Component({
  selector: 'app-list-dashboard',
  templateUrl: './list-dashboard.component.html',
  styleUrls: ['./list-dashboard.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ListDashboardComponent  {
  displayedColumns: string[] = [ 'select', 'name', 'status', 'createdDate', 'createdBy', 'edit'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _dialog: MatDialog,
    private _dashboardService: ListDashboardService,
  ) { }
  dataSource: MatTableDataSource<Dashboard>;
  dashboardCount: number = 0;
  selectedDashboard: Dashboard;

  searchInputControl: UntypedFormControl = new UntypedFormControl();

  dashboards$: Observable<Dashboard[]>;
  dashboards: Dashboard[];
  selection = new SelectionModel<Dashboard>(true, []);
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Dashboard>([]);
    this.dashboards$ = this._dashboardService.dashboards$;
    this._dashboardService.dashboards$.subscribe((dashboards) => {
      this.dashboardCount = dashboards.length;
      this.dataSource.data = dashboards;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
  
      this._changeDetectorRef.markForCheck();
    });
  
    this._dashboardService.getDashboard().subscribe();
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

  checkboxLabel(row?: Dashboard): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.dashboardId + 1}`;
  }

  addDashboard(){
    let dashboard = new Dashboard({})
    // this._changeDetectorRef.markForCheck();
    const restoreDialogRef = this._dialog.open(DashboardConfiguratorComponent, {
        height: "100%",
        width: "100%",
        maxWidth: "100%",
        maxHeight: "100%",
      autoFocus: false,
      data     : {
          note: cloneDeep(dashboard)
      }
    });
    restoreDialogRef.afterClosed().subscribe((result) => {
      this._dashboardService.getDashboard().pipe(takeUntil(this._unsubscribeAll)).subscribe();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



  


  openDashboardDialog(selectedDashboard: Dashboard): void {
    debugger;
    this._dashboardService.selectedDashboard(selectedDashboard);
    this._dialog.open(DashboardBuilderDialogComponent, {
      height: '100%',
      width: '100%',
      maxWidth: '100%',
      maxHeight: '100%',
      autoFocus: false,
      data: {
        dashboard: selectedDashboard,
      },
    });
  }

}
