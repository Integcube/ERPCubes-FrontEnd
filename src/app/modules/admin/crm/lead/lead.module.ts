import { NgModule ,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LeadComponent } from './lead.component';
import { LeadListComponent } from './lead-list/lead-list.component';
import { LeadFormComponent } from './lead-form/lead-form.component';
import { LeadDetailComponent } from './lead-detail/lead-detail.component';
import { LeadInfoComponent } from './lead-detail/lead-info/lead-info.component';
import { LeadDataComponent } from './lead-detail/lead-data/lead-data.component';
import { LeadActivityComponent } from './lead-detail/lead-wrapper/lead-activity/lead-activity.component';
import { LeadOverviewComponent } from './lead-detail/lead-wrapper/lead-overview/lead-overview.component';
import { LeadWrapperComponent } from './lead-detail/lead-wrapper/lead-wrapper.component';
import { NoteDetailComponent } from './lead-detail/notes/note-detail/note-detail.component';
import { NoteTabComponent } from './lead-detail/notes/note-tab/note-tab.component';
import { TaskDetailComponent } from './lead-detail/tasks/task-detail/task-detail.component';
import { TaskTabComponent } from './lead-detail/tasks/task-tab/task-tab.component';
import { ViewDetailComponent } from './lead-detail/view/view-detail/view-detail.component';
import { EmailTabComponent } from './lead-detail/email/email-tab/email-tab.component';
import { EmailDetailComponent } from './lead-detail/email/email-detail/email-detail.component';
import { ActivityDetailComponent } from './lead-detail/activity/activity-detail/activity-detail.component';
import { CallDetailComponent } from './lead-detail/call/call-detail/call-detail.component';
import { CallTabComponent } from './lead-detail/call/call-tab/call-tab.component';
import { MeetingDetailComponent } from './lead-detail/meeting/meeting-detail/meeting-detail.component';
import { MeetingTabComponent } from './lead-detail/meeting/meeting-tab/meeting-tab.component';
import { leadRoutes } from './lead.routing';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { QuillModule } from 'ngx-quill';
import { FormsModule } from '@angular/forms';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
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
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { FuseCardModule } from '@fuse/components/card';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'app/shared/shared.module';
import { FuseDrawerModule } from '@fuse/components/drawer';
import { FuseNavigationModule } from '@fuse/components/navigation';
import moment from 'moment';
import { SearchBarComponent } from './lead-detail/search-bar/search';
import { MatStepperModule } from '@angular/material/stepper';
import { LeadImportComponent } from './lead-import/lead-import.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { LeadStatusComponent } from './lead-status/lead-status.component';
import { LeadRestoreComponent } from './lead-restore/lead-restore.component';
import { LeadScoreComponent } from './lead-detail/lead-score/lead-score.component';

@NgModule({
  declarations: [
    LeadComponent,
    LeadListComponent,
    LeadFormComponent,
    LeadDetailComponent,
    LeadInfoComponent,
    LeadDataComponent,
    LeadActivityComponent,
    LeadOverviewComponent,
    LeadWrapperComponent,
    NoteDetailComponent,
    NoteTabComponent,
    TaskDetailComponent,
    TaskTabComponent,
    ViewDetailComponent,
    EmailTabComponent,
    EmailDetailComponent,
    ActivityDetailComponent,
    CallDetailComponent,
    CallTabComponent,
    MeetingDetailComponent,
    MeetingTabComponent,
    SearchBarComponent,
    LeadImportComponent,
    LeadStatusComponent,
    LeadRestoreComponent,
    LeadScoreComponent,
  ],
  imports: [
    RouterModule.forChild(leadRoutes),
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
    MatTooltipModule,
    MatExpansionModule,
    MatTabsModule,
    MatDialogModule,
    MatStepperModule,
    MatTableExporterModule,
    FuseFindByKeyPipeModule,
    FormsModule,
    FuseCardModule,
    FuseScrollbarModule ,
    FuseDrawerModule,
    DragDropModule,
    SharedModule,
    QuillModule,
    
  ],schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: moment.utc
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
export class LeadModule { }
