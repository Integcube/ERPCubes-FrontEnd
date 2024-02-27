import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, catchError, of, throwError } from 'rxjs';
import { OpportunityService } from './opportunity.service';
import { Opportunity, OpportunityFilter, TaskModel } from './opportunity.types';

@Injectable({
  providedIn: 'root'
})
export class OpportunityResolver implements Resolve<boolean> {
  constructor(
    private _opportunityService: OpportunityService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this._opportunityService.setFilter(new OpportunityFilter())
    return this._opportunityService.getOpportunity();
  }
}
@Injectable({
  providedIn: 'root'
})
export class OpportunitySourceResolver implements Resolve<boolean> {
  constructor(
    private _opportunityService: OpportunityService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this._opportunityService.getOpportunitySource();
  }
}
@Injectable({
  providedIn: 'root'
})
export class OpportunityStatusResolver implements Resolve<boolean> {
  constructor(
    private _opportunityService: OpportunityService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this._opportunityService.getOpportunityStatus();
  }
}
@Injectable({
  providedIn: 'root'
})
export class IndustryResolver implements Resolve<any>{
  constructor(private _opportunityService: OpportunityService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._opportunityService.getIndustries();
  }
}
@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<any>{
  constructor(private _opportunityService: OpportunityService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._opportunityService.getUsers();
  }
}
@Injectable({
  providedIn: 'root'
})
export class ProductResolver implements Resolve<any>{
  constructor(private _opportunityService: OpportunityService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._opportunityService.getProduct();
  }
}
@Injectable({
  providedIn: 'root'
})
export class CustomListResolver implements Resolve<any>{
  constructor(private _opportunityService: OpportunityService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._opportunityService.getCustomList();
  }
}
@Injectable({
  providedIn: "root"
})
export class EventTypeResolver implements Resolve<any>{
  constructor(private _opportunityService: OpportunityService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._opportunityService.getEventType();
  }
}

@Injectable({
  providedIn: 'root'
})
export class SelectedOpportunityResolver implements Resolve<any>
{
  constructor(
    private _router: Router,
    private _opportunityService: OpportunityService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Opportunity> {
    return this._opportunityService.getOpportunityId(+route.paramMap.get('id'))
      .pipe(
        catchError((error) => {
          console.error(error);
          const parentUrl = state.url.split('/').slice(0, -1).join('/');
          this._router.navigateByUrl(parentUrl);
          return throwError(error);
        })
      );
  }
}
@Injectable({
  providedIn: 'root'
})
export class CallResolver implements Resolve<any>{
  constructor(
    private _opportunityService: OpportunityService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._opportunityService.getCalls(+route.paramMap.get('id'));
  }
}
@Injectable({
  providedIn: 'root'
})
export class CallReasonResolver implements Resolve<any>{
  constructor(
    private _opportunityService: OpportunityService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._opportunityService.getScenarios();
  }
}
@Injectable({
  providedIn: 'root'
})
export class EmailResolver implements Resolve<any>{
  constructor(
    private _opportunityService: OpportunityService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._opportunityService.getEmails(+route.paramMap.get('id'));
  }
}
@Injectable({
  providedIn: 'root'
})
export class MeetingResolver implements Resolve<any>{
  constructor(
    private _opportunityService: OpportunityService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._opportunityService.getMeetings(+route.paramMap.get('id'));
  }
}
@Injectable({
  providedIn: 'root'
})
export class TaskResolver implements Resolve<any>
{
  constructor(
    private _router: Router,
    private _opportunityService: OpportunityService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TaskModel[]> {
    return this._opportunityService.getTasks(+route.paramMap.get('id'));
  }
}
@Injectable({
  providedIn: 'root'
})
export class TagsResolver implements Resolve<any>{
  constructor(private _opportunityService: OpportunityService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._opportunityService.getTags();
  }
}
@Injectable({
  providedIn: 'root'
})
export class NoteResolver implements Resolve<any>{
  constructor(private _opportunityService: OpportunityService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._opportunityService.getNotes(+route.paramMap.get('id'));
  }
}