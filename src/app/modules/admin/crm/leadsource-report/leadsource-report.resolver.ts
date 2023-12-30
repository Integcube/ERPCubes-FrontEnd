import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { LeadSourceReportService } from './leadsource-report.service';
@Injectable({
  providedIn: 'root'
})
export class LeadSourceReportResolver implements Resolve<any> {
  constructor(
    private _leadSourceReportService: LeadSourceReportService){ }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    var today : Date = new Date();
    const startOfMonth: Date = new Date(today.getFullYear(), today.getMonth(), -1);
    return this._leadSourceReportService.getLeadSourceReport(startOfMonth.toISOString(), today.toISOString(), -1);
  }
}
@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<any>{
  constructor(
    private _leadSourceReportService: LeadSourceReportService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._leadSourceReportService.getUsers();
  }
}
@Injectable({
  providedIn: 'root'
})
export class LeadStatusResolver implements Resolve<any>{
  constructor(
    private _leadSourceReportService: LeadSourceReportService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._leadSourceReportService.getSources();
  }
}

