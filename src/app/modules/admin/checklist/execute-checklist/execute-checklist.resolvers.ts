import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';

import { Observable, catchError, throwError } from 'rxjs';
import { ExecuteChecklistService } from './execute-checklist.service';
import { AssignedCheckPoint } from './execute-checklist.type';






@Injectable({
    providedIn: 'root'
  })
  export class ExcuteFormResolver implements Resolve<any>
  {
    constructor(
        private _router: Router,
        private _leadService:ExecuteChecklistService)
    {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AssignedCheckPoint[]>
    {
         const segments = state.url.split('/'); 
         const id = +segments[segments.length - 1]; 
         return this._leadService. getCheckpoint(id);
    }
  }


