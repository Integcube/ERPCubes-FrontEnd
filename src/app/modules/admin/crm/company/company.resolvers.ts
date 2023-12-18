import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { CompanyService } from './company.service';
import { Company, CompanyFilter, TaskModel } from './company.type';
import { Observable, catchError, throwError } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class CompaniesResolver implements Resolve<any>{
    constructor(private _companyService:CompanyService){
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        this._companyService.setFilter(new CompanyFilter())
       return this._companyService.getCompanies();
    }
}

@Injectable({
    providedIn:'root'
})
export class IndustryResolver implements Resolve<any>{
    constructor(private _companyService:CompanyService){
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      return this._companyService.getIndustries();
    }
}

@Injectable({
    providedIn:'root'
})
export class UserResolver implements Resolve<any>{
    constructor(private _companyService:CompanyService){
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      return this._companyService.getUsers();
    }
}

@Injectable({
    providedIn:'root'
})
export class CustomListResolver implements Resolve<any>{
    constructor(private _companyService:CompanyService){
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      return this._companyService.getCustomList();
    }
}

@Injectable({
    providedIn: 'root'
})
export class SelectedCompanyResolver implements Resolve<any>
{
    constructor(
        private _router: Router,
        private _companyService:CompanyService)
    {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Company>
    {
        return this._companyService.getCompanyById(+route.paramMap.get('id'))
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
@Injectable({
    providedIn:'root'
  })
  export class NoteResolver implements Resolve<any>{
    constructor(private _companyService:CompanyService){
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      return this._companyService.getNotes(+route.paramMap.get('id'));
    }
}
@Injectable({
    providedIn:'root'
  })
  export class CallResolver implements Resolve<any>{
    constructor(
      private _companyService:CompanyService)
      { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      return this._companyService.getCalls(+route.paramMap.get('id'));
    }
  }
  @Injectable({
    providedIn: 'root'
  })
  export class TaskResolver implements Resolve<any>
  {
    constructor(
        private _router: Router,
        private _companyService:CompanyService)
    {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TaskModel[]>
    {
        return this._companyService.getTasks(+route.paramMap.get('id'));
    }
  }
@Injectable({
    providedIn:'root'
  })
  export class EmailResolver implements Resolve<any>{
    constructor(
      private _companyService:CompanyService)
      { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      return this._companyService.getEmails(+route.paramMap.get('id'));
    }
  }
  @Injectable({
    providedIn:'root'
  })
  export class MeetingResolver implements Resolve<any>{
    constructor(
      private _companyService:CompanyService)
      { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      return this._companyService.getMeetings(+route.paramMap.get('id'));
    }
  }
  @Injectable({
    providedIn:'root'
  })
  export class TagsResolver implements Resolve<any>{
    constructor(private _companyService:CompanyService){
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      return this._companyService.getTags();
    }
  }

