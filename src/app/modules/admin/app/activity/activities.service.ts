import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
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
        )
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
            
        );
    }
    
}
