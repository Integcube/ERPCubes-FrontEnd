import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class TenantService {
    constructor(
        private _httpClient: HttpClient,
    ) {
    }
    checkSubdomainExists(subdomain: string): Observable<boolean> {
       let data={
        subdomain
        }
        let url = `${environment.url}/Tenant/checkTenant`
        return this._httpClient.post<boolean>(url,data);
    }
}
