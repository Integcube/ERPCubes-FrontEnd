import { Injectable } from '@angular/core';
import {Filter } from './activity-report.type';
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
    let filter = new Filter({});
    return this._activityReportService.getActivityReport(filter);
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

@Injectable({
  providedIn: 'root'
})
export class LeadStatusResolver implements Resolve<any>{
  constructor(
    private _activityReportService: ActivityReportService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._activityReportService.getLeadStatus();
  }
}

@Injectable({
  providedIn: 'root'
})
export class ProjectResolver implements Resolve<any>{
  constructor(
    private _activityReportService: ActivityReportService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._activityReportService.getProject();
  }
}



@Injectable({
  providedIn: 'root'
})
export class ProductResolver implements Resolve<any>{
  constructor(
    private _activityReportService: ActivityReportService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._activityReportService.getProducts();
  }
}

