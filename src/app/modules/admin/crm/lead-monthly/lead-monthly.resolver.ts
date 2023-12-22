import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { LeadMonthlyService } from './lead-monthly.service';

@Injectable({
  providedIn: 'root'
})
export class LeadMonthlyResolver implements Resolve<any> {
  constructor(
    private _leadMonthlyService: LeadMonthlyService){ }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    return this._leadMonthlyService.getLeadMonthly();
  }
}
@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<any>{
  constructor(
    private _leadMonthlyService: LeadMonthlyService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._leadMonthlyService.getUsers();
  }
}