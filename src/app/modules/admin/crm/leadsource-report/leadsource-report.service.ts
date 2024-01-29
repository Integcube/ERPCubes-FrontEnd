import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { LeadSource, LeadSourceReport } from './leadsource-report.type';

@Injectable({
  providedIn: 'root'
})
export class LeadSourceReportService {
  user: User;
  private readonly getUsersUrl = `${environment.url}/Users/all`
  private readonly getLeadSourceReportUrl = `${environment.url}/Lead/leadSourceWiseReport`
  private readonly getSourceUrl = `${environment.url}/Lead/allSource`
  
  private _users: BehaviorSubject<User[] | null> = new BehaviorSubject(null)
  private _leadSourceReport: BehaviorSubject<LeadSourceReport[] | null> = new BehaviorSubject(null)
  private _sources: BehaviorSubject<LeadSource[] | null> = new BehaviorSubject(null)
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
  get leadSourceReport$(): Observable<LeadSourceReport[]> {
    return this._leadSourceReport.asObservable()
  }
  get sourec$(): Observable<LeadSource[]> {
    return this._sources.asObservable()
}
  getLeadSourceReport(startDate: string, endDate: string, sourceId: number): Observable<LeadSourceReport[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      startDate: startDate,
      endDate: endDate,
      sourceId:+sourceId
    }
    return this._httpClient.post<LeadSourceReport[]>(this.getLeadSourceReportUrl, data).pipe(
      tap((activityreport) => {
          this._leadSourceReport.next(activityreport);
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
  
  getSources(): Observable<LeadSource[]> {
    let data = {
        id: this.user.id,
        tenantId: this.user.tenantId,
    }
    return this._httpClient.post<LeadSource[]>(this.getSourceUrl, data).pipe(
        tap((source) => {
            this._sources.next(source);
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
}
