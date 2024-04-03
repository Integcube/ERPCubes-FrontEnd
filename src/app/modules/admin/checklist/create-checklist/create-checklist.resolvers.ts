import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';

import { Observable, catchError, throwError } from 'rxjs';
import { CreateChecklistService } from './create-checklist.service';
import { Checklist } from './create-checklist.type';






@Injectable({
    providedIn: 'root'
  })
  export class CreateFormResolver implements Resolve<any>
  {
    constructor(
        private _router: Router,
        private _leadService:CreateChecklistService)
    {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Checklist>
    {
         const segments = state.url.split('/'); 
         const id = +segments[segments.length - 1]; 
         return this._leadService.getCheckListInfo(id);
    }
  }


