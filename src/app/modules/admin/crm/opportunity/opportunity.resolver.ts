import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { OpportunityService } from './opportunity.service';

@Injectable({
  providedIn: 'root'
})
export class OpportunityResolver implements Resolve<boolean> {
  constructor (
    private _opportunityService: OpportunityService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this._opportunityService.getOpportunity();
  }
}
@Injectable({
  providedIn: 'root'
})
export class OpportunitySourceResolver implements Resolve<boolean> {
  constructor (
    private _opportunityService: OpportunityService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this._opportunityService.getOpportunitySource();
  }
}