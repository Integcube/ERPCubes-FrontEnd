import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';
import { TranslocoModule } from '@ngneat/transloco';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TotalLeadsComponent } from './lead/total-leads/total-leads.component';
import { NewLeadsComponent } from './lead/new-leads/new-leads.component';
import { LostLeadComponent } from './lead/lost-leads/lost-leads.component';
import { QualifiedLeadComponent } from './lead/qualified-leads/qualified-leads.component';
import { WonLeadComponent } from './lead/won-leads/won-leads.component';
import { LeadOwnerGraphComponent } from './lead/leadowner-graph/leadowner-graph.component';
import { SourcePieChartComponent } from './lead/source-piechart/source-piechart.component';
import { MonthlyChartComponent } from './lead/monthly-chart/monthly-chart.component';
import { LeadSummaryChartComponent } from './lead/leadsummary-chart/leadsummary-chart.component';



@NgModule({
    declarations: [
        TotalLeadsComponent,
        NewLeadsComponent,
        LostLeadComponent,
        QualifiedLeadComponent,
        WonLeadComponent,
        LeadOwnerGraphComponent,
        SourcePieChartComponent,
        MonthlyChartComponent,
        LeadSummaryChartComponent
    ],
    imports: [
        SharedModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatProgressBarModule,
        MatRippleModule,
        MatSidenavModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        NgApexchartsModule,
        TranslocoModule,
        MatTooltipModule,
        FuseScrollbarModule,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
    ],
    exports: [
        TotalLeadsComponent,
        NewLeadsComponent,
        LostLeadComponent,
        QualifiedLeadComponent,
        WonLeadComponent,
        LeadOwnerGraphComponent,
        SourcePieChartComponent,
        MonthlyChartComponent,
        LeadSummaryChartComponent
    ]
})
export class WidgetModule {
}