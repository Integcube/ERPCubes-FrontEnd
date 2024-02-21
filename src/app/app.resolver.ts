import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable, catchError, map, of } from "rxjs";
import { TenantService } from "./core/tenantInterceptor/tenant.service";

@Injectable({
    providedIn: 'root'
})
export class AppResolver implements Resolve<any>
{
    constructor(
        private _tenantService: TenantService,
        private _router: Router
    ) {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | any {
        const subdomain = window.location.hostname.split('.')[0];
        return this._tenantService.checkSubdomainExists(subdomain).pipe(
            map((exists: boolean) => {
                if (exists) {
                    debugger
                    return true;
                } else {
                    debugger
                     window.location.href = 'https://thequantus.com';
                     return false;
                }
            }),
            catchError(() => {
                debugger
                window.location.href = 'https://thequantus.com';
                return of(false);
            })
        );
    }
}