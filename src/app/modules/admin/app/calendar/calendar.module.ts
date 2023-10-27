import { NgModule } from '@angular/core';
import { CalendarComponent } from './calendar.component';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { FullCalendarModule } from '@fullcalendar/angular';
export const routes: Route[] = [
  {
      path     : '',
      component: CalendarComponent
  }
];


@NgModule({
  declarations: [
    CalendarComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    FullCalendarModule
  ]
})
export class CalendarModule { }
