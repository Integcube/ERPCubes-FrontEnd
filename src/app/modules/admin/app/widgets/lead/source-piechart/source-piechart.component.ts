import { Component, OnInit } from '@angular/core';
import { ApexChart } from 'ng-apexcharts';
import { WidgetService } from '../../widget.service';

export type ChartOptions = {
  series?: number[];
  chart?: ApexChart;
  labels?: string[];
  colors?: string[];
};

@Component({
  selector: 'source-piechart',
  templateUrl: './source-piechart.component.html',
})
export class SourcePieChartComponent implements OnInit {
  pieChartOptions: Partial<ChartOptions>;

  constructor(private _widgetService: WidgetService) {}

  ngOnInit(): void {
    this.preparePieChartData();
  }

  preparePieChartData(): void {
    this._widgetService.getSourceLead().subscribe(
      (data) => {
        const leadSourceCounts = data.map((item) => ({
          source: item.source,
          count: item.totalLeads,
          color: getRandomColor(),
        }));

        this.pieChartOptions = {
          series: leadSourceCounts.map((item) => item.count),
          chart: {
            type: 'pie',
            height: 200,
          },
          labels: leadSourceCounts.map((item) => item.source),
          colors: leadSourceCounts.map((item) => item.color),
        };
      },
      (error) => {
        console.error('Error fetching source lead data:', error);
      }
    );
  }
}

function getRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
