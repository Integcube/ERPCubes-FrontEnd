import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Calendar } from '@fullcalendar/core';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { EventType } from './calendar.type';
import { ContactEnum } from 'app/core/enum/crmEnum';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertService } from 'app/core/alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private readonly getCalenderListURL = `${environment.url}/Calendar/all`
  private readonly saveCalenderListURL = `${environment.url}/Calendar/save`
  private readonly deleteCalenderURL = `${environment.url}/Calendar/delete`
  private readonly getEventTypeUrl = `${environment.url}/Calendar/type`

  user: User;
  enum = new ContactEnum();
  private _calenders: BehaviorSubject<Calendar[] | null> = new BehaviorSubject(null);
  private _eventType: BehaviorSubject<EventType[] | null> = new BehaviorSubject(null);
  constructor(
    private _userService: UserService,
    private _httpClient: HttpClient,
    private _alertService: AlertService)
  {
    this._userService.user$.subscribe(user => {this.user = user;})
  }

  get calenders$(): Observable<Calendar[]> {
    return this._calenders.asObservable();
  }
  get eventTypes$(): Observable<EventType[]> {
    return this._eventType.asObservable();
  }
  getEventType(): Observable<EventType[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<EventType[]>(this.getEventTypeUrl, data).pipe(
      tap((type) => {
        this._eventType.next(type);
      }),
      
    );
  }
  getCalender(): Observable<Calendar[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      leadId: -1,
      companyId: -1,
    }
    return this._httpClient.post<Calendar[]>(this.getCalenderListURL, data).pipe(
      tap((calenders) => {
        this._calenders.next(calenders);
      }),
      
    );
  }
  addUpdateCalendar(calendar: FormGroup) {
    let data: Calendar = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      ...calendar.value
    }
    return this._httpClient.post<Calendar[]>(this.saveCalenderListURL, data).pipe(
      tap((calenders) => {
        this.getCalender().subscribe();
      }),
      
    );
  }
  saveCalendar(event: any): Observable<any> {
 
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      contactTypeId: this.enum.All,
      activityId: this.enum.All,
      event
    }
    return this._httpClient.post<any>(this.saveCalenderListURL, data).pipe(
      tap((calenders) => {
        this._alertService.showSuccess("Event Saved Successfully");
        this.getCalender().subscribe();
      }),
      
    );
  }
  deleteCalendar(eventId: number, eventTitle: string): Observable<any> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      title: eventTitle,
      eventId: eventId
    }
    return this._httpClient.post<any>(this.deleteCalenderURL, data).pipe(
      tap((calenders) => {
        this.getCalender().subscribe();
      }),
      
    );
  }

}
