import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { CrmDashboardService } from "./crm-dashboard.service";

@Injectable({
    providedIn: 'root'
  })
  export class LeadsResolver implements Resolve<any> {
    constructor(
      private _crmDashbaordService: CrmDashboardService){ }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
      return this._crmDashbaordService.getLeads();
    }
  }
  
  @Injectable({
    providedIn: 'root'
  })
  export class TaskResolver implements Resolve<any>{
    constructor(
      private _crmDashbaordService: CrmDashboardService) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      return this._crmDashbaordService.getTasks();
    }
  }
  @Injectable({
    providedIn: 'root'
  })
  export class UserResolver implements Resolve<any>{
    constructor(
      private _crmDashbaordService: CrmDashboardService) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      return this._crmDashbaordService.getUsers();
    }
  }