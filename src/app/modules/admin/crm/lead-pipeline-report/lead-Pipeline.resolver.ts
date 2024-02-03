import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { leadPipelineService } from "./lead-pipeline.service";
import { LeadPipelineFilter } from "./lead-Pipeline.type";
@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<any>{
  constructor(
    private _leadReportService: leadPipelineService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._leadReportService.getUsers();
  }
}


@Injectable({
  providedIn: 'root'
})
export class LeadStatusResolver implements Resolve<any>{
  constructor(
    private _leadReportService: leadPipelineService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._leadReportService.getLeadStatus();
  }
}




@Injectable({
  providedIn: 'root'
})
export class ProductResolver implements Resolve<any>{
  constructor(
    private _leadReportService: leadPipelineService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._leadReportService.getProducts();
  }
}


@Injectable({
  providedIn:'root'
})
export class LeadSourceResolver implements Resolve<any>{
  constructor(private _leadReportService:leadPipelineService){
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
    private _leadReportService: leadPipelineService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
   let filter = new LeadPipelineFilter({});
    return this._leadReportService.getLeadReport(filter);
  }
}