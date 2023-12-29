import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadPipelineComponent } from './lead-pipeline.component';
import { RouterModule } from '@angular/router';
import { leadPipelineRoutes } from './lead-pipeline.routing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { SharedModule } from 'app/shared/shared.module';
import {CdkTableModule} from '@angular/cdk/table';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS } from '@angular/material/core';
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@NgModule({
  declarations: [
    LeadPipelineComponent
  ],
  imports: [
    RouterModule.forChild(leadPipelineRoutes),
    MatSnackBarModule,
    CommonModule,
    MatSortModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatMomentDateModule,
    MatProgressBarModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    CdkTableModule,
    MatTooltipModule,
    FuseFindByKeyPipeModule,
    SharedModule,
    MatTableModule,
    MomentDateModule
  ],
  providers: [
   { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],
})
export class leadPipelineModule { }