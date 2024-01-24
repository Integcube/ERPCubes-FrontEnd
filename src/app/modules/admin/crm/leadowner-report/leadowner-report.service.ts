import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { LeadOwnerReport, LeadSource, LeadStatus } from './leadowner-report.type';

@Injectable({
  providedIn: 'root'
})
export class LeadOwnerReportService {
  user: User;
  private readonly getUsersUrl = `${environment.url}/Users/all`
  private readonly getLeadOwnerReportUrl = `${environment.url}/Lead/leadOwnerWiseReport`
  private readonly getSourceUrl = `${environment.url}/Lead/allSource`
  private readonly getStatusUrl = `${environment.url}/Lead/allStatus`
  
  private _users: BehaviorSubject<User[] | null> = new BehaviorSubject(null)
  private _leadownerReport: BehaviorSubject<LeadOwnerReport[] | null> = new BehaviorSubject(null)
  private _sources: BehaviorSubject<LeadSource[] | null> = new BehaviorSubject(null)
  private _statuses: BehaviorSubject<LeadStatus[] | null> = new BehaviorSubject(null)
  private _usersList: BehaviorSubject<User[] | null> = new BehaviorSubject(null);
  constructor(
    private _userService: UserService,
    private _httpClient: HttpClient,
    private snackBar: MatSnackBar) 
  {
    this._userService.user$.subscribe(user => {
        this.user = user;
    })
  }
  get users$(): Observable<User[]> {
    return this._users.asObservable();
  }
  get leadOwnerReport$(): Observable<LeadOwnerReport[]> {
    return this._leadownerReport.asObservable()
  }
  get sourec$(): Observable<LeadSource[]> {
    return this._sources.asObservable()
  }
  get statesus$(): Observable<LeadStatus[]> {
    return this._statuses.asObservable()
  }
  get usersList$(): Observable<User[]> {
    return this._usersList.asObservable();
  }
  getLeadOwnerReport(startDate: string, endDate: string, sourceId: number, statusId:number, leadOwner: string): Observable<LeadOwnerReport[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      startDate: startDate,
      endDate: endDate,
      sourceId:sourceId,
      status:statusId,
      leadOwner:leadOwner
    }
    return this._httpClient.post<LeadOwnerReport[]>(this.getLeadOwnerReportUrl, data).pipe(
      tap((ownerreport) => {
          this._leadownerReport.next(ownerreport);
      }),
      catchError(err=>this.handleError(err))
    );
  }
  getUsers(): Observable<User[]> {
    let data = {
        id: this.user.id,
        tenantId: this.user.tenantId,
    }
    return this._httpClient.post<User[]>(this.getUsersUrl, data).pipe(
        tap((users) => {
            this._users.next(users);
        }),
        catchError(err=>this.handleError(err))
    );
  }
  getUsersList(): Observable<User[]> {
    let data = {
        id: this.user.id,
        tenantId: this.user.tenantId,
    }
    return this._httpClient.post<User[]>(this.getUsersUrl, data).pipe(
        tap((usersList) => {
            this._usersList.next(usersList);
        }),
        catchError(err=>this.handleError(err))
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
  getSources(): Observable<LeadSource[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<LeadSource[]>(this.getSourceUrl, data).pipe(
      tap((source) => {
        this._sources.next(source);
      }),
      catchError(err => this.handleError(err))
    );
  }
  getStatuses(): Observable<LeadStatus[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<LeadStatus[]>(this.getStatusUrl, data).pipe(
      tap((source) => {
        this._statuses.next(source);
      }),
      catchError(err => this.handleError(err))
    );
  }
}
