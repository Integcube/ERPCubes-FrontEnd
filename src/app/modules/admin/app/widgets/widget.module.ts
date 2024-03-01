import { NgModule } from '@angular/core';
import { WidgetComponent } from './widget.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { widgetsRoutes } from './widget.routing';
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
import { LeadComponent } from './lead/lead.component';



@NgModule({
    declarations: [
        WidgetComponent,
        TotalLeadsComponent,
        NewLeadsComponent,
        LeadComponent
        
    ],
    imports     : [
        RouterModule.forChild(widgetsRoutes),
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
})
export class WidgetModule
{
}