import { Injectable } from '@angular/core';
import { Dashboard } from './list-dashboard.type';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { AlertService } from 'app/core/alert/alert.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ListDashboardService {

  private readonly getDashboardListURL = `${environment.url}/Dashboard/all`


  private _dashboard: BehaviorSubject<Dashboard | null> = new BehaviorSubject(null);
  private _dashboards: BehaviorSubject<Dashboard[] | null> = new BehaviorSubject(null);
  user: User;
  constructor(
    private _userService: UserService,
    private _alertService: AlertService,
    private _httpClient: HttpClient,
    private snackBar: MatSnackBar) 
  {
    this._userService.user$.subscribe(user => {this.user = user;})
  }
  get dashboard$(): Observable<Dashboard> {
    return this._dashboard.asObservable();
  }
  get dashboards$(): Observable<Dashboard[]> {
    return this._dashboards.asObservable();
  }
  selectedDashboard(selectedDashboard: Dashboard) {
    this._dashboard.next(selectedDashboard);
  }

  getDashboard(): Observable<Dashboard[]> {
    
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    debugger;
    return this._httpClient.post<Dashboard[]>(this.getDashboardListURL, data).pipe(
      tap((dashboards) => {
        this._dashboards.next(dashboards);
      }),
      
    );
  }
}
