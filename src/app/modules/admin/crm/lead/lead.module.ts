import { NgModule } from '@angular/core';
import { LeadComponent } from './lead.component';
import { LeadListComponent } from './lead-list/lead-list.component';
import { LeadFormComponent } from './lead-form/lead-form.component';
import { LeadDetailComponent } from './lead-detail/lead-detail.component';
import { LeadInfoComponent } from './lead-detail/lead-info/lead-info.component';
import { LeadDataComponent } from './lead-detail/lead-data/lead-data.component';
import { LeadActivityComponent } from './lead-detail/lead-wrapper/lead-activity/lead-activity.component';
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
import { RouterModule } from '@angular/router';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { SharedModule } from 'app/shared/shared.module';
import moment from 'moment';
import { leadRoutes } from './lead.routing';
import { LeadOverviewComponent } from './lead-detail/lead-wrapper/lead-overview/lead-overview.component';
import { LeadWrapperComponent } from './lead-detail/lead-wrapper/lead-wrapper.component';
import { NoteDetailComponent } from './lead-detail/notes/note-detail/note-detail.component';
import { NoteTabComponent } from './lead-detail/notes/note-tab/note-tab.component';
import { FuseCardModule } from '@fuse/components/card';
import { TaskDetailComponent } from './lead-detail/tasks/task-detail/task-detail.component';
import { TaskTabComponent } from './lead-detail/tasks/task-tab/task-tab.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';
import { ViewDetailComponent } from './lead-detail/view/view-detail/view-detail.component';
import { EmailTabComponent } from './lead-detail/email/email-tab/email-tab.component';
import { EmailDetailComponent } from './lead-detail/email/email-detail/email-detail.component';
import { QuillModule } from 'ngx-quill';
import { ActivityDetailComponent } from './lead-detail/activity/activity-detail/activity-detail.component';
import { CallDetailComponent } from './lead-detail/call/call-detail/call-detail.component';
import { CallTabComponent } from './lead-detail/call/call-tab/call-tab.component';
import { MeetingDetailComponent } from './lead-detail/meeting/meeting-detail/meeting-detail.component';
import { MeetingTabComponent } from './lead-detail/meeting/meeting-tab/meeting-tab.component';



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
    MeetingTabComponent
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
    QuillModule,
    MatSelectModule,
    MatSidenavModule,
    MatTableModule,
    MatTooltipModule,
    FuseFindByKeyPipeModule,
    SharedModule,
    MatExpansionModule,
    MatTabsModule,
    FuseCardModule,
    DragDropModule,
    MatDialogModule,
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
export class LeadModule { }
