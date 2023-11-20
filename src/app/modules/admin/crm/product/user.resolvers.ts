import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { UserForm } from './user.type';
import { Observable, catchError, throwError } from 'rxjs';
import { UserFormService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class UsersResolver implements Resolve<any>{
    constructor(private _userService:UserFormService){
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
       return this._userService.getUsers();
    }
}

@Injectable({
    providedIn: 'root'
})
export class SelectedUserResolver implements Resolve<any>
{
    constructor(
        private _router: Router,
        private _userService:UserFormService)
    {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UserForm>
    {
        return this._userService.getUserById(route.paramMap.get('id'))
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
