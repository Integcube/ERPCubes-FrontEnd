import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { FileManagerService } from './file-manager.service';
import { Item } from './file-manager.types';
import { tap } from 'lodash';


@Injectable({
    providedIn: 'root'
})
export class FileManagerItemsResolver implements Resolve<any>
{
    constructor(private _fileManagerService: FileManagerService)
    {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Item[]>
    {
        return this._fileManagerService.getItems(0);
    }
}

@Injectable({
    providedIn: 'root'
})
export class FileManagerFolderResolver implements Resolve<any>
{
    constructor(
        private _router: Router,
        private _fileManagerService: FileManagerService
    )
    {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Item[]>
    {
        return this._fileManagerService.getItems(+route.paramMap.get('folderId'))
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
    providedIn: 'root'
})
export class FileManagerItemResolver implements Resolve<any>
{
    constructor(
        private _router: Router,
        private _fileManagerService: FileManagerService
    )
    {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Item>
    {
        return this._fileManagerService.getItemById(+route.paramMap.get('id'))
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
