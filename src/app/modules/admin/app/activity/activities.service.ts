import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { Activity } from './activities.types';
import { environment } from 'environments/environment';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class ActivitiesService
{
    private readonly getUserActivityURL = `${environment.url}/UserActivity/Get`
    private readonly getUsersUrl = `${environment.url}/Users/all`
    private _activities: BehaviorSubject<Activity[] | null> = new BehaviorSubject(null);
    private _users: BehaviorSubject<User[] | null> = new BehaviorSubject(null)
    user: User;
    constructor(
        private _userService: UserService,
        private _httpClient: HttpClient,
        private snackBar: MatSnackBar)
    {   
        this._userService.user$.subscribe(user => {
            this.user = user;
        })
    }
    get activities$(): Observable<any>{
        return this._activities.asObservable();
    }
    get users$(): Observable<any>{
        return this._users.asObservable();
    }
    getActivities(count:number): Observable<any> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            count,
            contactTypeId:-1,
            contactId:-1,
        }
        return this._httpClient.post<Activity[]>(this.getUserActivityURL, data).pipe(
            tap((response: Activity[]) => {
                this._activities.next(response);
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
