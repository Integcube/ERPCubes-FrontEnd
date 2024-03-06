import { Component, OnInit } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexNonAxisChartSeries, ApexPlotOptions, ApexXAxis } from 'ng-apexcharts';
import { WidgetService } from '../../widget.service';

export type ChartOptions2 = {
  series?: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart?: ApexChart;
  dataLabels?: ApexDataLabels;
  plotOptions?: ApexPlotOptions;
  xaxis?: ApexXAxis;
};

@Component({
  selector: 'monthly-chart',
  templateUrl: './monthly-chart.component.html',
})
export class MonthlyChartComponent implements OnInit {
  barChartOptions: Partial<ChartOptions2>;

  constructor(private widgetService: WidgetService) {}

  ngOnInit(): void {
    this.prepareBarChartData();
  }

  prepareBarChartData(): void {
    this.widgetService.getMonthLead().subscribe(
      (data) => {
        debugger;
        const leadMonthCounts = data.map((item) => ({
          month: item.monthName.trim(), 
          count: item.totalLeadsCount,
        }));

        this.barChartOptions = {
          series: [
            {
              name: 'Leads',
              data: leadMonthCounts.map((item) => item.count),
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
            categories: leadMonthCounts.map((item) => item.month),
          },
          // Additional options as needed
        };
      },
      (error) => {
        console.error('Error fetching monthly lead data:', error);
      }
    );
  }
}
