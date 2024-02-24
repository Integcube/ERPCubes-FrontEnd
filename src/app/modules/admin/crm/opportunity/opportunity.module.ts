import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpportunityComponent } from './opportunity.component';
import { OpportunityListComponent } from './opportunity-list/opportunity-list.component';
import { OpportunityFormComponent } from './opportunity-form/opportunity-form.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_FORMATS, MatRippleModule } from '@angular/material/core';
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
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { SharedModule } from 'app/shared/shared.module';
import { opportunityRoutes } from './opportunity.routing';
import { OpportunityDetailComponent } from './opportunity-detail/opportunity-detail.component';
import { ActivityDetailComponent } from './opportunity-detail/activity/activity-detail/activity-detail.component';
import { CallDetailComponent } from './opportunity-detail/call/call-detail/call-detail.component';
import { CallTabComponent } from './opportunity-detail/call/call-tab/call-tab.component';
import { EmailDetailComponent } from './opportunity-detail/email/email-detail/email-detail.component';
import { EmailTabComponent } from './opportunity-detail/email/email-tab/email-tab.component';
import { OpportunityDataComponent } from './opportunity-detail/opportunity-data/opportunity-data.component';
import { OpportunityInfoComponent } from './opportunity-detail/opportunity-info/opportunity-info.component';
import { OpportunityWrapperComponent } from './opportunity-detail/opportunity-wrapper/opportunity-wrapper.component';
import { MeetingDetailComponent } from './opportunity-detail/meeting/meeting-detail/meeting-detail.component';
import { MeetingTabComponent } from './opportunity-detail/meeting/meeting-tab/meeting-tab.component';
import { NoteDetailComponent } from './opportunity-detail/notes/note-detail/note-detail.component';
import { NoteTabComponent } from './opportunity-detail/notes/note-tab/note-tab.component';
import { TaskDetailComponent } from './opportunity-detail/tasks/task-detail/task-detail.component';
import { TaskTabComponent } from './opportunity-detail/tasks/task-tab/task-tab.component';
import { ViewDetailComponent } from './opportunity-detail/view/view-detail/view-detail.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { QuillModule } from 'ngx-quill';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { FuseCardModule } from '@fuse/components/card';
import { MatTableExporterModule } from 'mat-table-exporter';
import moment from 'moment';
import { OpportunityActivityComponent } from './opportunity-detail/opportunity-wrapper/opportunity-activity/opportunity-activity.component';
import { OpportunityOverviewComponent } from './opportunity-detail/opportunity-wrapper/opportunity-overview/opportunity-overview.component';



@NgModule({
  declarations: [
    OpportunityComponent,
    OpportunityListComponent,
    OpportunityFormComponent,
    OpportunityDetailComponent,
    OpportunityDataComponent,
    OpportunityInfoComponent,
    OpportunityActivityComponent,
    OpportunityOverviewComponent,
    OpportunityWrapperComponent,
    ActivityDetailComponent,
    CallDetailComponent,
    CallTabComponent,
    EmailDetailComponent,
    EmailTabComponent,
    MeetingDetailComponent,
    MeetingTabComponent,
    NoteDetailComponent,
    NoteTabComponent,
    TaskDetailComponent,
    TaskTabComponent,
    ViewDetailComponent,
  ],
  imports: [
    RouterModule.forChild(opportunityRoutes),
    CommonModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatExpansionModule,
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
    MatTableModule,
    MatTooltipModule,
    FuseFindByKeyPipeModule,
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
    MatTableModule,
    MatTableExporterModule,
    MatTooltipModule,
    QuillModule,
    FuseFindByKeyPipeModule,
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
    QuillModule,
    MatSelectModule,
    MatSidenavModule,
    MatTableModule,
    MatTooltipModule,
    FuseFindByKeyPipeModule,
    MatExpansionModule,
    MatTabsModule,
    FuseCardModule,
    DragDropModule,
    MatDialogModule,
    SharedModule
  ],
  providers: [
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: moment.ISO_8601
        },
        display: {
          dateInput: 'll',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY'
        }
      }
    }
  ]
})
export class OpportunityModule { }
