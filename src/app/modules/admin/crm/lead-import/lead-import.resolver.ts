import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { LeadImportService } from './lead-import.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class LeadImportResolver implements Resolve<any> {
//   constructor(
//     private _leadImportService: LeadImportService){ }
//   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
//     return this._leadImportService.getLeads();
//   }
// }
@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<any>{
  constructor(
    private _leadImportService: LeadImportService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._leadImportService.getUsers();
  }
}