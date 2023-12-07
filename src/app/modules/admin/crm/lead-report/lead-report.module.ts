import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadReportComponent } from './lead-report.component';
import { RouterModule } from '@angular/router';
import { leadReportRoutes } from './lead-report.routing';
import { MatSnackBarModule } from '@angular/material/snack-bar';



@NgModule({
  declarations: [
    LeadReportComponent
  ],
  imports: [
    RouterModule.forChild(leadReportRoutes),
    MatSnackBarModule
  ]
})
export class LeadReportModule { }
