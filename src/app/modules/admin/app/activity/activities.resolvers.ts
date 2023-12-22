import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ActivitiesService } from './activities.service';

@Injectable({
    providedIn: 'root'
})
export class ActivitiesResolver implements Resolve<any>
{
    constructor(private _activityService: ActivitiesService) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this._activityService.getActivities(1);
    }
}
@Injectable({
    providedIn:'root'
})
export class UserResolver implements Resolve<any>{
    constructor(private _activityService: ActivitiesService) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
      return this._activityService.getUsers();
    }
}