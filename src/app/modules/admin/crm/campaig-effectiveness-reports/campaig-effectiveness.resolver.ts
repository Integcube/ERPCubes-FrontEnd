import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { CampaigEffectivenessService } from "./campaig-effectiveness.service";
import { LeadPipelineFilter } from "./campaig-effectiveness.type";
@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<any>{
  constructor(
    private _leadReportService: CampaigEffectivenessService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._leadReportService.getUsers();
  }
}


@Injectable({
  providedIn: 'root'
})
export class LeadStatusResolver implements Resolve<any>{
  constructor(
    private _leadReportService: CampaigEffectivenessService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._leadReportService.getLeadStatus();
  }
}




@Injectable({
  providedIn: 'root'
})
export class ProductResolver implements Resolve<any>{
  constructor(
    private _leadReportService: CampaigEffectivenessService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
   debugger
    return this._leadReportService.getProducts();
  }
}


@Injectable({
  providedIn:'root'
})
export class LeadSourceResolver implements Resolve<any>{
  constructor(private _leadReportService:CampaigEffectivenessService){
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._leadReportService.getLeadSource();
  }
}


@Injectable({
  providedIn: 'root'
})
export class LeadReportResolver implements Resolve<any>{
  constructor(
    private _leadReportService: CampaigEffectivenessService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
   let filter = new LeadPipelineFilter({});
   debugger
    return this._leadReportService.getLeadReport(filter);
  }
}