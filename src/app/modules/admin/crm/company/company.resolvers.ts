import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { CompanyService } from './company.service';
import { Company } from './company.type';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CompaniesResolver implements Resolve<any>{
    constructor(private _companyService:CompanyService){
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
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