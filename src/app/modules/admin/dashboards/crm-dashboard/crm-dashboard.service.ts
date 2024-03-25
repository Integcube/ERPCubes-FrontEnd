import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { Dashboard, Lead,Task } from './crm-dashboard.type';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CrmDashboardService {
  private readonly getLeadsURL = `${environment.url}/Lead/all`
  private readonly getTasksURL = `${environment.url}/Task/all`
  private readonly getUsersURL = `${environment.url}/Users/all`
  private readonly getDashboardListURL = `${environment.url}/Dashboard/all`

  user: User;
  currentDate: Date = new Date();
  private _users: BehaviorSubject<User[] | null> = new BehaviorSubject(null);
  private _tasks: BehaviorSubject<Task[] | null> = new BehaviorSubject(null);
  private _dashboards: BehaviorSubject<Dashboard[] | null> = new BehaviorSubject(null);

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



  get tasks$():Observable<Task[]>{
    return this._tasks.asObservable();
  }
  get dashboards$(): Observable<Dashboard[]> {
    return this._dashboards.asObservable();
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
    );
  }

  
  


  getDashboard(): Observable<Dashboard[]> {
    
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<Dashboard[]>(this.getDashboardListURL, data).pipe(
      tap((dashboards) => {
        this._dashboards.next(dashboards);
      }),
      
    );
  }

}
