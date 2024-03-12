import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { LeadOwnerReport } from 'app/modules/admin/crm/leadowner-report/leadowner-report.type';
import { WidgetService } from '../../widget.service';
import { Subject, takeUntil } from 'rxjs';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexNonAxisChartSeries, ApexPlotOptions, ApexXAxis } from 'ng-apexcharts';
export type ChartOptions2 = {
  series?: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart?: ApexChart;
  dataLabels?: ApexDataLabels;
  plotOptions?: ApexPlotOptions;
  xaxis?: ApexXAxis;
};

@Component({
  selector: 'leadowner-graph',
  templateUrl: './leadowner-graph.component.html',
})
export class LeadOwnerGraphComponent {
  barChartOptions: Partial<ChartOptions2>;

  constructor(private widgetService: WidgetService) {}

  ngOnInit(): void {
    this.prepareBarChartData();
  }

  prepareBarChartData(): void {
    this.widgetService.getOwnerLead().subscribe(
      (data) => {
        const leadOwnerCounts = data.map((item) => ({
          owner: item.leadOwnerName.trim(), 
          count: item.totalLeads,
        }));

        this.barChartOptions = {
          series: [
            {
              name: 'Leads',
              data: leadOwnerCounts.map((item) => item.count),
            },
          ],
          chart: {
            type: 'bar',
            height: 250,
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '55%',
            },
          },
          xaxis: {
            categories: leadOwnerCounts.map((item) => item.owner),
          },
        };
      },
      (error) => {
        console.error('Error fetching monthly lead data:', error);
      }
    );
  }
}
