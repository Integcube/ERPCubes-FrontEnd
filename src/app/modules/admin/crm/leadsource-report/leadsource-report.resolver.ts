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
    
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(),currentDate.getMonth(),1);
    const endingDate = new Date();
    const  endDate = new Date(currentDate.getFullYear(),currentDate.getMonth()+1,0);    

    return this._leadSourceReportService.getLeadSourceReport(startOfMonth.toISOString(), endDate.toISOString(), -1);
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

