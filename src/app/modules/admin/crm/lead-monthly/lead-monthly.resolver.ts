import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { LeadMonthlyService } from './lead-monthly.service';
import { LeadMonthlyFilter } from './lead-monthly.type';

@Injectable({
  providedIn: 'root'
})
export class LeadMonthlyResolver implements Resolve<any> {
  constructor(
    private _leadMonthlyService: LeadMonthlyService){ }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    let filter = new LeadMonthlyFilter({});
    return this._leadMonthlyService.getLeadMonthly(filter);
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

@Injectable({
  providedIn: 'root'
})
export class ProductResolver implements Resolve<any>{
  constructor(
    private _leadMonthlyService: LeadMonthlyService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._leadMonthlyService.getProducts();
  }
}


@Injectable({
  providedIn:'root'
})
export class LeadSourceResolver implements Resolve<any>{
  constructor(private _leadMonthlyService:LeadMonthlyService){
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._leadMonthlyService.getLeadSource();
  }
}