import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { LeadMonthly } from './lead-monthly.type';

@Injectable({
  providedIn: 'root'
})
export class LeadMonthlyService {
  user: User;
  private readonly getUsersUrl = `${environment.url}/Users/all`
  private readonly getLeadMonthlyUrl = `${environment.url}/Lead/leadByMonth`
  private _users: BehaviorSubject<User[] | null> = new BehaviorSubject(null)
  private _leadMonthly: BehaviorSubject<LeadMonthly[] | null> = new BehaviorSubject(null)
  constructor(
    private _userService: UserService,
    private _httpClient: HttpClient,
    private snackBar: MatSnackBar) 
  {
    this._userService.user$.subscribe(user => {
        this.user = user;
    })
  }
  get leadMonthly$(): Observable<LeadMonthly[]> {
    return this._leadMonthly.asObservable()
  }
  getLeadMonthly(): Observable<LeadMonthly[]> {
    let data = {
        tenantId: this.user.tenantId,
        id: this.user.id,
    };

    return this._httpClient.post<LeadMonthly[]>(this.getLeadMonthlyUrl, data).pipe(
        tap((leadMonthly) => {
            this._leadMonthly.next(leadMonthly);
        }),
        catchError((err) => this.handleError(err))
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
