import { formatDate } from "@angular/common";
import { Calendar } from "@fullcalendar/core";
export interface EventType {
    typeId: number,
    typeTitle: string
}
export interface CustomCalendarEvent extends Calendar {
    extendedProps: {
      type: number; // Assuming 'type' is a number property
      // Include other extended properties here if needed
    };
  }
export class CalendarEvent{
    id: number;
    userId: string;
    title: string;
    type: number;
    start: string;
    end: string;
    createdBy: number;
    createdDate: string;
    tenantId: number;
    allDay:boolean;
    constructor(reg){
        this.id = reg.eventId?reg.eventId:-1;
        this.start = formatDate(new Date(), "yyyy-MM-dd", "en") || "";
        this.end = formatDate(new Date(), "yyyy-MM-dd", "en") || "";
    }
}