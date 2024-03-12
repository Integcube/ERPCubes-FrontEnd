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
  private readonly saveDashboardListURL = `${environment.url}/Dashboard/save`
  private readonly saveWidgetListURL = `${environment.url}/Dashboard/saveWidget`
  private readonly deleteDashboardListURL = `${environment.url}/Dashboard/delete`

  

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
  saveDashboard(dashboard: Dashboard) {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      dashboard,

    }
    debugger;
    return this._httpClient.post<Dashboard[]>(this.saveDashboardListURL, data).pipe(
      tap((dashboard) => {
        this._alertService.showSuccess("Dashboard Saved Successfully");
        // this.getDashboard().subscribe();
      }),
    );
  }
  saveWidget(dashboardId: number, widgets: string) {
    debugger;
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      dashboardId: dashboardId,
      widgets: widgets

    }
    debugger;
    return this._httpClient.post<Dashboard[]>(this.saveWidgetListURL, data).pipe(
      tap((dashboard) => {
        this._alertService.showSuccess("Dashboard Saved Successfully");
        // this.getDashboard().subscribe();
      }),
    );
  }
  deleteDashboard(dashboardId: number): Observable<Dashboard> {
    let data = {
      id: this.user.id,
      dashboardId: dashboardId
    }
    return this._httpClient.post<Dashboard>(this.deleteDashboardListURL, data).pipe(
      tap((note) => {
        this.getDashboard().subscribe();
      }),
      
    );
  }
}
