import { Component, OnInit } from '@angular/core';
import { ApexChart } from 'ng-apexcharts';
import { WidgetService } from '../../widget.service';
import { TotalLeadSummary } from '../../widget.type';

export type ChartOptions = {
  series?: number[];
  chart?: ApexChart;
  labels?: string[];
  colors?: string[];
};

@Component({
  selector: 'leadsummary-chart',
  templateUrl: './leadsummary-chart.component.html',
})
export class LeadSummaryChartComponent implements OnInit {
  pieChartOptions: Partial<ChartOptions>;

  constructor(private _widgetService: WidgetService) {}

  ngOnInit(): void {
    this.preparePieChartData();
  }

preparePieChartData(): void {
  this._widgetService.getSummaryLead().subscribe(
    (data: TotalLeadSummary) => {
      const leadSourceCounts = [
        { source: 'New Leads', count: data.totalNewLeads, color: getRandomColor() },
        { source: 'Qualified Leads', count: data.totalQualifiedLeads, color: getRandomColor() },
        { source: 'Lost Leads', count: data.totalLostLeads, color: getRandomColor() },
        { source: 'Won Leads', count: data.totalWonLeads, color: getRandomColor() },
      ];

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
      console.error('Error fetching lead summary data:', error);
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
