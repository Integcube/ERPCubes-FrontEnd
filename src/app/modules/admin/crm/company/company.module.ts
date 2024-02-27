import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { CompanyComponent } from './company.component';
import { companyRoutes } from './company.routing';
import { CompanyListComponent } from './company-list/company-list.component';
import { CompanyFormComponent } from './company-form/company-form.component';
import { SharedModule } from 'app/shared/shared.module';
import { MAT_DATE_FORMATS, MatRippleModule } from '@angular/material/core';
import moment from 'moment';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { CompanyInfoComponent } from './company-detail/company-info/company-info.component';
import { CompanyDataComponent } from './company-detail/company-data/company-data.component';
import {MatTabsModule} from '@angular/material/tabs';
import { ViewDetailComponent } from './company-detail/view/view-detail/view-detail.component';
import { ActivityDetailComponent } from './company-detail/activity/activity-detail/activity-detail.component';
import { CompanyWrapperComponent } from './company-detail/company-wrapper/company-wrapper.component';
import { QuillModule } from 'ngx-quill';
import { CompanyActivityComponent } from './company-detail/company-wrapper/company-activity/company-activity.component';
import { CallDetailComponent } from './company-detail/call/call-detail/call-detail.component';
import { CallTabComponent } from './company-detail/call/call-tab/call-tab.component';
import { EmailTabComponent } from './company-detail/email/email-tab/email-tab.component';
import { EmailDetailComponent } from './company-detail/email/email-detail/email-detail.component';
import { MeetingDetailComponent } from './company-detail/meeting/meeting-detail/meeting-detail.component';
import { MeetingTabComponent } from './company-detail/meeting/meeting-tab/meeting-tab.component';
import { NoteDetailComponent } from './company-detail/notes/note-detail/note-detail.component';
import { NoteTabComponent } from './company-detail/notes/note-tab/note-tab.component';
import { TaskDetailComponent } from './company-detail/tasks/task-detail/task-detail.component';
import { TaskTabComponent } from './company-detail/tasks/task-tab/task-tab.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';
import { FuseCardModule } from '@fuse/components/card';
import { SearchBarComponent } from './company-detail/search-bar/search';
import { MatTableExporterModule } from 'mat-table-exporter';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { FuseDrawerModule } from '@fuse/components/drawer';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';
import { TrashModule } from '../trash/trash.module';



@NgModule({
  declarations: [
    CompanyComponent,
    CompanyListComponent,
    CompanyFormComponent,
    CompanyDetailComponent,
    CompanyInfoComponent,
    CompanyDataComponent,
    ViewDetailComponent,
    ActivityDetailComponent,
    CompanyWrapperComponent,
    CompanyActivityComponent,
    CallDetailComponent,
    CallTabComponent,
    EmailTabComponent,
    EmailDetailComponent,
    MeetingDetailComponent,
    MeetingTabComponent,
    NoteDetailComponent,
    NoteTabComponent,
    TaskDetailComponent,
    TaskTabComponent,
    SearchBarComponent
  ],
  imports: [
    RouterModule.forChild(companyRoutes),
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
    MatTableExporterModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    FormsModule,
    FuseScrollbarModule ,
    FuseDrawerModule,
    TrashModule
  ],
  providers: [
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: moment.ISO_8601
        },
        display: {
          dateInput: 'LL',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY'
        }
      }
    }
  ]
})
export class CompanyModule { }
