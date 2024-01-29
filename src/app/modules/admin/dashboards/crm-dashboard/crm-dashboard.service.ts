import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { Lead,Task } from './crm-dashboard.type';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CrmDashboardService {
  private readonly getLeadsURL = `${environment.url}/Lead/all`
  private readonly getTasksURL = `${environment.url}/Task/all`
  private readonly getUsersURL = `${environment.url}/Users/all`

  user: User;
  currentDate: Date = new Date();
  private _leads: BehaviorSubject<Lead[] | null> = new BehaviorSubject(null);
  private _users: BehaviorSubject<User[] | null> = new BehaviorSubject(null);
  private _tasks: BehaviorSubject<Task[] | null> = new BehaviorSubject(null);
  constructor(
    private _httpClient: HttpClient,
    private _userService: UserService,
    private snackBar: MatSnackBar) 
  {
    this._userService.user$.subscribe(user => {this.user = user;})
  }

  get users$():Observable<User[]>{
    return this._users.asObservable();
  }

  get leads$():Observable<Lead[]>{
    return this._leads.asObservable();
  }

  get tasks$():Observable<Task[]>{
    return this._tasks.asObservable();
  }

  getLeads(): Observable<Lead[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<Lead[]>(this.getLeadsURL, data).pipe(
      tap((leads) => {
        this._leads.next(leads);
      }),
      catchError(err => this.handleError(err))
    );
  }

  getTasks(): Observable<Task[]> {
    let data = {
      tenantId: this.user.tenantId,
      id: this.user.id,
      leadId: -1,
      companyId: -1
    }
    return this._httpClient.post<Task[]>(this.getTasksURL, data).pipe(
      tap((tasks) => {
        this._tasks.next(tasks)
      }),
      catchError(err => this.handleError(err))
    );
  }

  getUsers(): Observable<User[]> {
    let data = {
      tenantId: this.user.tenantId,
      id: this
        .user.id
    }
    return this._httpClient.post<User[]>(this.getUsersURL, data).pipe(
      tap((users) => {
        this._users.next(users);
      }),
      catchError(err => this.handleError(err))
    );
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Backend returned code ${err.status}: ${err.message}`;
    }
    this.showNotification('snackbar-success', errorMessage, 'bottom', 'center');
    return throwError(() => errorMessage);
  }
  
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
}
