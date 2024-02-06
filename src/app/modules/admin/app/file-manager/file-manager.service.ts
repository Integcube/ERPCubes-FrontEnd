import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { Item } from './file-manager.types';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'environments/environment';
import { User } from 'app/core/user/user.types';
import { ContactEnum } from 'app/core/enum/crmEnum';
import { UserService } from 'app/core/user/user.service';

@Injectable({
    providedIn: 'root'
})
export class FileManagerService {
    private readonly getFiles = `${environment.url}/DocumentLibrary/all`
    user: User;
    contactEnumInstance: ContactEnum = new ContactEnum();

    private _items: BehaviorSubject<Item[] | null> = new BehaviorSubject(null);
    private _item: BehaviorSubject<Item | null> = new BehaviorSubject(null);

    constructor(
        private _httpClient: HttpClient,
        private _userService:UserService,
        private snackBar: MatSnackBar) { 
            this._userService.user$.subscribe(user => {this.user = user;});
        }

    get items$(): Observable<Item[]> {
        return this._items.asObservable();
    }

    get item$(): Observable<Item> {
        return this._item.asObservable();
    }

    // set item$(item:Item) {
    //      this.item$ = of(item);
    // }

    getItems(folderId: number): Observable<Item[]> {
        let data = {
            id:this.user.id,
            tenantId:this.user.tenantId,
            parentId:folderId,
            contactTypeId:this.contactEnumInstance.All,
            ContactId:this.contactEnumInstance.All,
        }
        return this._httpClient.post<Item[]>(this.getFiles, data).pipe(
            tap((response: any) => {
                this._items.next(response);
            }),
            catchError(err => this.handleError(err))
        );
    }

    // getItemById(id: string): Observable<Item>
    // {
    //     return this._items.pipe(
    //         take(1),
    //         map((items) => {

    //             // Find within the folders and files
    //             const item = [...items.folders, ...items.files].find(value => value.id === id) || null;

    //             // Update the item
    //             this._item.next(item);

    //             // Return the item
    //             return item;
    //         }),
    //         switchMap((item) => {

    //             if ( !item )
    //             {
    //                 return throwError('Could not found the item with id of ' + id + '!');
    //             }

    //             return of(item);
    //         })
    //     );
    // }

    private handleError(err: HttpErrorResponse): Observable<never> {
        let errorMessage: string;
        if (err.error instanceof ErrorEvent) {
            errorMessage = `An error occurred: ${err.error.message}`;
        } else {
            errorMessage = `Backend returned code ${err.status}: ${err.message}`;
        }
        this.showNotification('snackbar-success', errorMessage, 'bottom', 'center');
        return throwError(() => errorMessage);
    }

    showNotification(colorName, text, placementFrom, placementAlign) {
        this.snackBar.open(text, "", {
            duration: 2000,
            verticalPosition: placementFrom,
            horizontalPosition: placementAlign,
            panelClass: colorName,
        });
    }
}
