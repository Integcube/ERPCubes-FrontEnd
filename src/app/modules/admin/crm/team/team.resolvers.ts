import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { TeamService } from './team.service';
import { Team, TeamMembers } from './team.type';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TeamsResolver implements Resolve<any>{
    constructor(private _teamService: TeamService) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        return this._teamService.getTeams();
    }
}
@Injectable({
    providedIn: 'root'
})
export class UserResolver implements Resolve<any>{
    constructor(private _teamService: TeamService) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this._teamService.getEmployeeList();
    }
}
@Injectable({
    providedIn: 'root'
})
export class SelectedTeamResolver implements Resolve<any>
{
    constructor(
        private _router: Router,
        private _teamService: TeamService) {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Team> {
        return this._teamService.getTeamById(+route.paramMap.get('id'))
            .pipe(
                catchError((error) => {
                    console.error(error);
                    const parentUrl = state.url.split('/').slice(0, -1).join('/');
                    this._router.navigateByUrl(parentUrl);
                    return throwError(error);
                })
            );
    }
}
