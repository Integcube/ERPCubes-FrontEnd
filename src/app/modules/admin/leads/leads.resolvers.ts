import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { LeadsService } from './leads.service';

@Injectable({
  providedIn: 'root'
})
export class LeadsResolver implements Resolve<any>{
  constructor(private _leadService: LeadsService)
  {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._leadService.getLeadList();
  }

}
