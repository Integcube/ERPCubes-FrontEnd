// import { Injectable } from '@angular/core';
// import {
//     HttpEvent,
//     HttpInterceptor,
//     HttpHandler,
//     HttpRequest,
// } from '@angular/common/http';
// import { EMPTY, Observable, switchMap } from 'rxjs';
// import { TenantService } from './tenant.service';

// @Injectable()
// export class tenantInterceptor implements HttpInterceptor {
//     constructor(private _tenantService: TenantService) {

//     }
//     intercept(
//         req: HttpRequest<any>,
//         next: HttpHandler
//     ): Observable<HttpEvent<any>> {
//         const subdomain = window.location.hostname.split('.')[0];
//         if(subdomain){
//             return this._tenantService.checkSubdomainExists(subdomain).pipe(
//                 switchMap((exists) => {
//                     if (exists) {
//                         return next.handle(req);
//                     } else {
//                         window.location.href = 'https://thequantus.com';
//                         return EMPTY;
//                     }
//                 })
//             );
//         }
//         else{
//             window.location.href = 'https://thequantus.com';
//         }
//     }
// }
