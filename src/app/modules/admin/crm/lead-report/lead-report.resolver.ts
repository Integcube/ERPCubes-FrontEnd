import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { LeadReportService } from "./lead-report.service";

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<any>{
  constructor(
    private _leadReportService: LeadReportService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._leadReportService.getUsers();
  }
}
@Injectable({
  providedIn: 'root'
})
export class LeadStatusResolver implements Resolve<any>{
  constructor(
    private _leadReportService: LeadReportService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._leadReportService.getLeadStatus();
  }
}
@Injectable({
  providedIn: 'root'
})
export class LeadReportResolver implements Resolve<any>{
  constructor(
    private _leadReportService: LeadReportService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._leadReportService.getLeadReport();
  }
}