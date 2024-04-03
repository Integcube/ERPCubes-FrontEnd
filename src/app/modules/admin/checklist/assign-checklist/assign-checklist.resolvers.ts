import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';

import { Observable, catchError, throwError } from 'rxjs';
import { AssignChecklistService } from './assign-checklist.service';
import { CheckListInfo } from './assign-checklist.type';


@Injectable({
    providedIn: 'root'
})
export class AssignCheckListResolver implements Resolve<any>{
    constructor(private _userService:AssignChecklistService){
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
       return this._userService.getAssignCheckList();
    }
}


@Injectable({
    providedIn: 'root'
})
export class CheckListResolver implements Resolve<any>{
    constructor(private _userService:AssignChecklistService){
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
       return this._userService.getCheckList();
    }
}

@Injectable({
    providedIn: 'root'
})
export class UserResolver implements Resolve<any>{
    constructor(private _userService:AssignChecklistService){
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
       return this._userService.getUsers();
    }
}


@Injectable({
    providedIn: 'root'
  })
  export class AssignFormResolver implements Resolve<any>
  {
    constructor(
        private _router: Router,
        private _leadService:AssignChecklistService)
    {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CheckListInfo>
    {
         const segments = state.url.split('/'); 
         const id = +segments[segments.length - 1]; 
         return this._leadService.getCheckListInfo(id);
    }
  }


