import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { TasksService } from './tasks.service';
import { Tag, Task } from './tasks.types';
import { User } from 'app/core/user/user.types';


@Injectable({
    providedIn: 'root'
})
export class TaskTagsResolver implements Resolve<any>
{
    constructor(private _tasksService: TasksService)
    {  }   
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Tag[]>
    {
        return this._tasksService.getTags();
    }
}

@Injectable({
    providedIn: 'root'
})
export class TasksResolver implements Resolve<any>
{
    constructor(private _tasksService: TasksService)
    {    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Task[]>
    {
        return this._tasksService.getTasks();
    }
}

@Injectable({
    providedIn: 'root'
})
export class UsersResolver implements Resolve<any>
{
    constructor(private _tasksService: TasksService)
    {    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User[]>
    {
        return this._tasksService.getUsers();
    }
}

@Injectable({
    providedIn: 'root'
})
export class SelectedTaskResolver implements Resolve<any>
{
    constructor(
        private _router: Router,
        private _taskService: TasksService
    ) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Task>
    {
        return this._taskService.getTaskById(+route.paramMap.get('id'))
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
