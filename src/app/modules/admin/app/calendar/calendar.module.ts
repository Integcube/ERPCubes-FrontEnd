import { NgModule } from '@angular/core';
import { CalendarComponent } from './calendar.component';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarDetailComponent } from './calendar-detail/calendar-detail.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
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
import { FuseCardModule } from '@fuse/components/card';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { CalendarResolver, EventTypeResolver } from './calendar.resolver';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';

export const routes: Route[] = [
  {
      path     : '',
      component: CalendarComponent,
      resolve:{
        type:EventTypeResolver,
        calendar:CalendarResolver,
      }
  }
];


@NgModule({
  declarations: [
    CalendarComponent,
    CalendarDetailComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    FullCalendarModule,
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
    FuseFindByKeyPipeModule,
    MatExpansionModule,
    MatTabsModule,
    FuseCardModule,
    DragDropModule,
    MatDialogModule,
    FuseScrollbarModule ,
  ]
})
export class CalendarModule { }
