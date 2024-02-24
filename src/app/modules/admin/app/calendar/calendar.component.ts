import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CalendarOptions, EventApi, DateSelectArg, EventClickArg, EventDropArg, Calendar } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { CalendarService } from './calendar.service';
import { BehaviorSubject, Observable, Subject, combineLatest, map, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CalendarDetailComponent } from './calendar-detail/calendar-detail.component';
import { CalendarEvent, CustomCalendarEvent, EventType } from './calendar.type';
import { cloneDeep } from 'lodash';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnInit, OnDestroy {
  private _selectedTypes: BehaviorSubject<number[] | null> = new BehaviorSubject(null);
  selectedTypes$ = this._selectedTypes.asObservable();
  events$ = combineLatest([
    this._calendarService.calenders$,
    this.selectedTypes$,
  ]).pipe(
    map(([events, tags]) => {
      if (tags && tags.length) {
        return events.filter((e:any) => tags.includes(e.type));
      } else {
        return events;
      }
    })
  );
  selectedTypes: number[] = [];
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  eventTypes$ = this._calendarService.eventTypes$
  calendarVisible = true;
  calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    buttonText: {
      today: 'Today',
      month: 'Month',
      week: 'Week',
      day: 'Day',
      list: 'List'
    },
    eventDidMount: this.setEventColor.bind(this),
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    eventDrop: this.handleEventDrop.bind(this),
  };
  toggleType(type: EventType, change: MatCheckboxChange): void {
    const foundLabelIndex = this.selectedTypes.findIndex(a => a === type.typeId);
    if (foundLabelIndex===-1) {
      this.selectedTypes.push(type.typeId) 
    } else {
      this.selectedTypes.splice(foundLabelIndex, 1);
    }
    this._selectedTypes.next(this.selectedTypes);
    this._changeDetectorRef.markForCheck();
  }
  setEventColor(info: { event: EventApi; el: HTMLElement; view: any }): void {
    const eventType = info.event.extendedProps.type;
    let fontColor = 'white';
    let eventColor = '';
  
    switch (eventType) {
      case 1:
        eventColor = '#800000'; // Maroon color for eventType 1
        break;
      case 2:
        eventColor = '#53B958'; // Green color for eventType 2
        break;
      case 3:
        eventColor = '#FF0000'; // Red color for eventType 3
        break;
      case 4: 
        eventColor = '#FFD700'; // Gold color for eventType 4
        break;
      case 5:
        eventColor = '#800080'; // Purple color for eventType 5
        break;
      default:
        eventColor = '#007BFF'; // Default blue color for other event types
        break;
    }
  
    info.el.style.color = fontColor;
    info.el.style.borderColor = eventColor;
    info.el.style.backgroundColor = eventColor;
  }
  
  
  currentEvents: EventApi[] = [];
  constructor(private _calendarService: CalendarService, 
    private _matDialog: MatDialog,
    private _changeDetectorRef: ChangeDetectorRef,
  ){}

  ngOnInit() {
    this.events$.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
      this.calendarOptions.events = data;
      this._changeDetectorRef.markForCheck();
    });
  }

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  addEvent() {
    let event = new CalendarEvent({});
 
    const currentDate = new Date();
    event.start = new Date(currentDate);
    event.start.setHours(currentDate.getHours(), currentDate.getMinutes());
    event.end = new Date(currentDate);
    event.end.setHours((currentDate.getHours()+1), currentDate.getMinutes());
    this._matDialog.open(CalendarDetailComponent, {
      autoFocus: false,
      data: {
        event: cloneDeep(event)
      }
    });
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    let event = new CalendarEvent({});
    const currentDate = new Date();
    event.start = new Date(selectInfo.start);
    event.start.setHours(currentDate.getHours(), currentDate.getMinutes());
    event.end = new Date(selectInfo.start);
    event.end.setHours((currentDate.getHours()+1), currentDate.getMinutes());
    
    event.allDay = selectInfo.allDay;
    this._matDialog.open(CalendarDetailComponent, {
      autoFocus: false,
      data: {
        event: cloneDeep(event)
      }
    });
  }

  handleEventClick(clickInfo: EventClickArg) {
    const eventDataWithCustomType = {
      start:clickInfo.event.start,
      end:clickInfo.event.end,
      id:clickInfo.event.id,
      allDay:clickInfo.event.allDay,
      title:clickInfo.event.title,
      type: clickInfo.event.extendedProps?.type || 0 
    };    
    this._matDialog.open(CalendarDetailComponent, {
      autoFocus: false,
      data: {
        event: cloneDeep(eventDataWithCustomType)
      }
    });
  }

  handleEventDrop(eventDropInfo: EventDropArg) {
    const eventDataWithCustomType = {
      start:eventDropInfo.event.start,
      end:eventDropInfo.event.end,
      id:eventDropInfo.event.id,
      allDay:eventDropInfo.event.allDay,
      title:eventDropInfo.event.title,
      type: eventDropInfo.event.extendedProps?.type || 0 
    };   
    this._calendarService.saveCalendar(eventDataWithCustomType).pipe(takeUntil(this._unsubscribeAll)).subscribe(
      data=>{this._changeDetectorRef.markForCheck()}
    )
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }
}
