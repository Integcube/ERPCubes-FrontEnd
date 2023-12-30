import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { LeadOwnerReportService } from './leadowner-report.service';

@Injectable({
  providedIn: 'root'
})
export class LeadOwnerReportResolver implements Resolve<any> {
  constructor(
    private _leadOwnerReportService: LeadOwnerReportService){ }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    var today : Date = new Date();
    const startOfMonth: Date = new Date(today.getFullYear(), today.getMonth(), -1);
    return this._leadOwnerReportService.getLeadOwnerReport(startOfMonth.toISOString(), today.toISOString(), -1,-1,"-1");
  }
}
@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<any>{
  constructor(
    private _leadOwnerReportService: LeadOwnerReportService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._leadOwnerReportService.getUsers();
  }
}
@Injectable({
  providedIn: 'root'
})
export class LeadStatusResolver implements Resolve<any>{
  constructor(
    private _leadOwnerReportService: LeadOwnerReportService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._leadOwnerReportService.getStatuses();
  }
}
@Injectable({
  providedIn: 'root'
})
export class LeadSourceResolver implements Resolve<any>{
  constructor(
    private _leadOwnerReportService: LeadOwnerReportService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._leadOwnerReportService.getSources();
  }
}
@Injectable({
  providedIn: 'root'
})
export class LeadUserListResolver implements Resolve<any>{
  constructor(
    private _leadOwnerReportService: LeadOwnerReportService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._leadOwnerReportService.getUsersList();
  }
}

