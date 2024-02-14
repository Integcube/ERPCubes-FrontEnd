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
    private readonly deleteFile = `${environment.url}/DocumentLibrary/delete`
    private readonly updateFile = `${environment.url}/DocumentLibrary/update`
    private readonly downloadFileUrl = `${environment.url}/DocumentLibrary/getfile`
    
    user: User;
    contactEnumInstance: ContactEnum = new ContactEnum();

    private _items: BehaviorSubject<Item[] | null> = new BehaviorSubject(null);
    private _item: BehaviorSubject<Item | null> = new BehaviorSubject(null);
    private _folder: BehaviorSubject<Item | null> = new BehaviorSubject(null);
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
        private snackBar: MatSnackBar) {
        this._userService.user$.subscribe(user => { this.user = user; });
    }

    get items$(): Observable<Item[]> {
        return this._items.asObservable();
    }

    get item$(): Observable<Item> {
        return this._item.asObservable();
    }

    get folder$(): Observable<Item> {
        return this._folder.asObservable();
    }

    setFolder(folderId: number) {
        this.items$.pipe(
            tap(a => {
                const folder = a.find(value => value.fileId === folderId) || null;
                this._folder.next(folder);
            })
        ).subscribe();

    }

    updateDescription(value: string, fileId: number): Observable<any> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            fileId: fileId,
            description: value
        }
        return this._httpClient.post<any>(this.updateFile, data).pipe(
            tap((response: Item[]) => {
                let items: Item[] = this._items.value;
                let index = items.findIndex(a => a.fileId === fileId);
                items[index].description = value;
                this._items.next(items);
            }),
            catchError(err => this.handleError(err))
        );
    }
    
    // addFolder():Observable<Item>{
    //     let data = {
    //         id: this.user.id,
    //         tenantId: this.user.tenantId,
    //         fileId: fileId,
    //     }
    //     return this._httpClient.post<any>(this.deleteFile, data).pipe(
    //         tap((response: Item[]) => {
    //             let items: Item[] = this._items.value;
    //             let index = items.findIndex(a => a.fileId === fileId);
    //             items.splice(index, 1);
    //             this._items.next(items);
    //         }),
    //         catchError(err => this.handleError(err))
    //     );
    // }
    // addDocument():Observable<Item>{

    // }
    deletedItems(fileId: number): Observable<any> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            fileId: fileId,
        }
        return this._httpClient.post<any>(this.deleteFile, data).pipe(
            tap((response: Item[]) => {
                let items: Item[] = this._items.value;
                let index = items.findIndex(a => a.fileId === fileId);
                items.splice(index, 1);
                this._items.next(items);
            }),
            catchError(err => this.handleError(err))
        );
    }
    downloadFile(path: string): Observable<any> {
        const fullUrl = `${this.downloadFileUrl}?filePath=${path}`;
        return this._httpClient.get(fullUrl, {
            responseType: 'blob',
            observe: 'response'
        }).pipe(          
            catchError(err => this.handleError(err))
        );
    }
    getItems(folderId: number): Observable<Item[]> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            parentId: folderId,
            contactTypeId: this.contactEnumInstance.All,
            ContactId: this.contactEnumInstance.All,
        }
        return this._httpClient.post<Item[]>(this.getFiles, data).pipe(
            tap((response: Item[]) => {
                this._items.next(response);
                this.setFolder(folderId)

            }),
            catchError(err => this.handleError(err))
        );
    }

    getItemById(id: number): Observable<Item> {
        return this._items.pipe(
            take(1),
            map((items) => {
             
                    let item = items.find(value => value.fileId === id) || null;
                    this._item.next(item);
                    return item;
                         
            }),
            switchMap((item) => {

                if (!item) {
                    return throwError('Could not found the item with id of ' + id + '!');
                }

                return of(item);
            })
        );
    }

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
