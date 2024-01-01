import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, catchError, of, throwError } from 'rxjs';
import { ProjectService } from './project.service';
import { Project } from './project.type';

@Injectable({
  providedIn: 'root'
})
export class ProjectResolver implements Resolve<any> {
  constructor(
    private _projectService: ProjectService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._projectService.getProject();
  }
}
@Injectable({
  providedIn: 'root'
})
export class CompanyResolver implements Resolve<any> {
  constructor(
    private _projectService: ProjectService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._projectService.getCompany();
  }
}
@Injectable({
  providedIn: 'root'
})
export class SelectedProjectResolver implements Resolve<any> {
  constructor(
    private _router: Router,
    private _projectService: ProjectService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Project> {
    return this._projectService.getProjectById(+route.paramMap.get('id'))
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