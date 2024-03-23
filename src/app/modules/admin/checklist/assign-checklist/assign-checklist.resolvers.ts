import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';

import { Observable, catchError, throwError } from 'rxjs';
import { AssignChecklistService } from './assign-checklist.service';


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
