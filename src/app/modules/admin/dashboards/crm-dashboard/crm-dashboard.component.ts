import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'app/core/user/user.service';
import { CrmDashboardService } from './crm-dashboard.service';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'app/core/user/user.types';
import { Lead, Task } from './crm-dashboard.type';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexNonAxisChartSeries, ApexOptions, ApexPlotOptions, ApexXAxis, ChartComponent } from 'ng-apexcharts';
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
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class CrmDashboardComponent implements OnInit, OnDestroy {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  displayedColumns: string[] = ['name', 'email', 'phone', 'leadStatus', 'createdDate'];
  user: User
  users: User[]
  tasks: Task[]
  leads: Lead[]
  filterLeads:Lead[]=[];
  selectedFilter:any;
  filterMonth = [
    {
      title: 'this month',
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    },
    {
      title: '3 months',
      startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 2, 1),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    },
    {
      title: '6 months',
      startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    },
    {
      title: '9 months',
      startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 8, 1),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    },
    {
      title: '12 months',
      startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 11, 1),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    }
  ];
  
  todayTasks: Task[]
  pieChartOptions: Partial<ChartOptions>;
  barChartOptions: Partial<ChartOptions2>;
    constructor(
    private _userService: UserService,
    private _dashboardService: CrmDashboardService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  ngOnInit(): void {
    this.selectedFilter = {...this.filterMonth[0]}
    this._userService.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
      this.user = { ...data };
      this._changeDetectorRef.markForCheck();
    })
    this._dashboardService.users$.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
      this.users = [...data ];
      this._changeDetectorRef.markForCheck();
    })
    this._dashboardService.leads$.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
      this.leads = [...data]  ;
      this.calculateLeads(this.selectedFilter);      
      this._changeDetectorRef.markForCheck();
    })
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
    this.preparePieChartData();
    this.prepareBarChartData();
  }
  calculateLeadNumber(status: number):number {
    let leads= this.leads.filter(lead=>lead.status === status);
    return leads?.length??0
  }
  preparePieChartData(): void {
    const leadStatusCounts = [
      { status: 'New', count: this.calculateLeadNumber(1), color: '#FFD700' }, // New Leads
      { status: 'Qualified', count: this.calculateLeadNumber(4), color: '#800080' }, // Qualified Leads
      { status: 'Won', count: this.calculateLeadNumber(6), color: '#008000' }, // Won Leads
      { status: 'Lost', count: this.calculateLeadNumber(5), color: '#FF0000' }, // Lost Leads
    ];

    this.pieChartOptions = {
      series: leadStatusCounts.map(item => item.count),
      chart: {
        type: 'pie',
        height: 200
      },
      labels: leadStatusCounts.map(item => item.status),
      colors: leadStatusCounts.map(item => item.color),
    };
  }
  prepareBarChartData(): void {
    const leadStatusCounts = [
      { status: 'New', count: this.calculateLeadNumber(1) },
      { status: 'Qualified', count: this.calculateLeadNumber(4) },
      { status: 'Won', count: this.calculateLeadNumber(6) },
      { status: 'Lost', count: this.calculateLeadNumber(5) },
      // Add more statuses as needed
    ];
  
    this.barChartOptions = {
      series: [
        {
          name: 'Leads',
          data: leadStatusCounts.map(item => item.count)
        }
      ],
      chart: {
        type: 'bar',
        height: 250
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
        }
      },
      xaxis: {
        categories: leadStatusCounts.map(item => item.status)
      },
      // Additional options as needed
    };
  }
  setFilter(filter:any){
    this.selectedFilter = {...filter}
    this.calculateLeads(this.selectedFilter);
  }
  calculateLeads(filterItem): void {
    this.filterLeads = this.leads.filter((lead: Lead) => {
      const leadDate = new Date(lead.createdDate);
      return leadDate >= filterItem.startDate && leadDate <= filterItem.endDate;
    });
    this._changeDetectorRef.markForCheck();
  }
  
}
