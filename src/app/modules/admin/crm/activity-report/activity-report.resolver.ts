import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { ActivityReportService } from './activity-report.service';
@Injectable({
  providedIn: 'root'
})
export class ActivityReportResolver implements Resolve<any> {
  constructor(
    private _activityReportService: ActivityReportService){ }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    return this._activityReportService.getActivityReport();
  }
}
@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<any>{
  constructor(
    private _activityReportService: ActivityReportService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._activityReportService.getUsers();
  }
}
