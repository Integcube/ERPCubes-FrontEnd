import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';

import { Observable, catchError, throwError } from 'rxjs';
import { LeadService } from './lead.service';
import { Lead, LeadFilter, TaskModel } from './lead.type';
@Injectable({
  providedIn:'root'
})
export class EmailResolver implements Resolve<any>{
  constructor(
    private _leadService:LeadService)
    { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._leadService.getEmails(+route.paramMap.get('id'));
  }
}
@Injectable({
  providedIn:'root'
})
export class CallResolver implements Resolve<any>{
  constructor(
    private _leadService:LeadService)
    { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._leadService.getCalls(+route.paramMap.get('id'));
  }
}
@Injectable({
  providedIn:'root'
})
export class CallReasonCResolver implements Resolve<any>{
  constructor(
    private _leadService:LeadService)
    { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._leadService.getScenarios();
  }
}


@Injectable({
  providedIn:'root'
})
export class MeetingResolver implements Resolve<any>{
  constructor(
    private _leadService:LeadService)
    { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._leadService.getMeetings(+route.paramMap.get('id'));
  }
}
@Injectable({
    providedIn: 'root'
})
export class LeadsResolver implements Resolve<any>{
    constructor(private _leadService:LeadService){
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      this._leadService.setFilter(new LeadFilter())
       return this._leadService.getLeads();
    }
}
@Injectable({
    providedIn:'root'
})
export class IndustryResolver implements Resolve<any>{
    constructor(private _leadService:LeadService){
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      return this._leadService.getIndustries();
    }
}
@Injectable({
    providedIn:'root'
})
export class UserResolver implements Resolve<any>{
    constructor(private _leadService:LeadService){
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      return this._leadService.getUsers();
    }
}
@Injectable({
  providedIn:'root'
})
export class CustomListResolver implements Resolve<any>{
  constructor(private _leadService:LeadService){
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._leadService.getCustomList();
  }
}
@Injectable({
  providedIn:'root'
})
export class ProductResolver implements Resolve<any>{
  constructor(private _leadService:LeadService){
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._leadService.getProduct();
  }
}
@Injectable({
  providedIn:'root'
})
export class CampaignsResolver implements Resolve<any>{
  constructor(private _leadService:LeadService){
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._leadService.getCampaigns();
  }
}
@Injectable({
  providedIn:'root'
})
export class LeadSourceResolver implements Resolve<any>{
  constructor(private _leadService:LeadService){
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._leadService.getLeadSource();
  }
}

@Injectable({
  providedIn:'root'
})
export class LeadStatusResolver implements Resolve<any>{
  constructor(private _leadService:LeadService){
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._leadService.getLeadStatus();
  }
}
@Injectable({
  providedIn:'root'
})
export class TagsResolver implements Resolve<any>{
  constructor(private _leadService:LeadService){
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._leadService.getTags();
  }
}
@Injectable({
  providedIn:'root'
})
export class NoteResolver implements Resolve<any>{
  constructor(private _leadService:LeadService){
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._leadService.getNotes(+route.paramMap.get('id'));
  }
}

@Injectable({
    providedIn: 'root'
})
export class SelectedLeadResolver implements Resolve<any>
{
    constructor(
        private _router: Router,
        private _leadService:LeadService)
    {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Lead>
    {
        return this._leadService.getLeadById(+route.paramMap.get('id'))
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
export class TaskResolver implements Resolve<any>
{
  constructor(
      private _router: Router,
      private _leadService:LeadService)
  {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TaskModel[]>
  {
      return this._leadService.getTasks(+route.paramMap.get('id'));
  }
}

@Injectable({
  providedIn: "root"
})
export class EventTypeResolver implements Resolve<any>{
  constructor(private _leadService: LeadService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      return this._leadService.getEventType();
  }
}

@Injectable({
  providedIn: "root"
})
export class ScoreResolver implements Resolve<any>{
  constructor(private _leadService: LeadService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      return this._leadService.GetLeadScore(+route.paramMap.get('id'));
  }
}
