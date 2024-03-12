import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'app/core/user/user.service';
import { CrmDashboardService } from './crm-dashboard.service';
import { Observable, Subject, of, takeUntil } from 'rxjs';
import { User } from 'app/core/user/user.types';
import { Dashboard, Lead, Task } from './crm-dashboard.type';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexNonAxisChartSeries, ApexOptions, ApexPlotOptions, ApexXAxis, ChartComponent } from 'ng-apexcharts';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
export type ChartOptions = {
  series?: number[];
  chart?: ApexChart;
  labels?: string[];
  colors?: string[];
};
export type ChartOptions2 = {
  series?: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart?: ApexChart;
  dataLabels?: ApexDataLabels;
  plotOptions?: ApexPlotOptions;
  xaxis?: ApexXAxis;
};
@Component({
  selector: 'app-crm-dashboard',
  templateUrl: './crm-dashboard.component.html',
  styleUrls: ['./crm-dashboard.component.scss'],
})
export class CrmDashboardComponent implements OnInit, OnDestroy {

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  dashboards$: Observable<Dashboard[]>;
  dashboards: Dashboard[];
  user: User
  tasks: Task[]

  todayTasks: Task[]
    constructor(
    private _dashboardService: CrmDashboardService,
    private _userService: UserService,
    private _changeDetectorRef: ChangeDetectorRef,

  ) { }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  ngOnInit(): void {
     this._dashboardService.getDashboard().subscribe();
    this._dashboardService.dashboards$.pipe(takeUntil(this._unsubscribeAll))
    .subscribe((dashboards: Dashboard[]) => {
      this.dashboards = [...dashboards];
    });
    this._userService.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
      this.user = { ...data };
      this._changeDetectorRef.markForCheck();
    });
    this._dashboardService.tasks$.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
      this.tasks = [ ...data];
      const today = new Date();
      this.todayTasks = this.tasks.filter((task: Task) => {
        const taskDate = new Date(task.createdDate);
        return (
          taskDate.getFullYear() === today.getFullYear() &&
          taskDate.getMonth() === today.getMonth() &&
          taskDate.getDate() === today.getDate()
        );
      });
      this._changeDetectorRef.markForCheck();
    })

  }

  
  
}
