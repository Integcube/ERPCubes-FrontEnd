import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from 'environments/environment';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeletedItems } from './trash.type';

@Injectable({
    providedIn: 'root'
})
export class TrashService {
    private readonly getDeletedProductListUrl = `${environment.url}/Product/del`
    private readonly restoreBulkProductUrl = `${environment.url}/Product/restoreBulk`
    private readonly restoreProductUrl = `${environment.url}/Product/restore`
    private readonly getDeletedLeadListUrl = `${environment.url}/Lead/allDeleted`
    private readonly restoreLeadUrl = `${environment.url}/Lead/restore`
    private readonly restoreBulkLeadUrl = `${environment.url}/Lead/restoreBulkLead`
    private readonly getDeletedUsersUrl = `${environment.url}/Users/del`
    private readonly restoreUserListUrl = `${environment.url}/Users/restore`
    private readonly restoreBulkUserUrl = `${environment.url}/Users/restoreBulkUser`

    
    user: User;
    constructor(
        private _userService: UserService,
        private _httpClient: HttpClient,
        private snackBar: MatSnackBar) {
        this._userService.user$.subscribe(user => {
            this.user = user;
        })
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
    getDeletedProducts(): Observable<DeletedItems[]> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        return this._httpClient.post<DeletedItems[]>(this.getDeletedProductListUrl, data).pipe(
            catchError(err => this.handleError(err))
        );
    }
    restoreProduct(product: DeletedItems): Observable<DeletedItems> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            productId: product.id
        };
        return this._httpClient.post<DeletedItems>(this.restoreProductUrl, data).pipe(
            tap(() => {
                this.showNotification('snackbar-success', 'Product restored successfully', 'bottom', 'center');
            }),
            catchError(err => this.handleError(err))
        );
    }
    restoreBulkProduct(productIds: number[]): Observable<DeletedItems[]> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            productId: productIds
        };
        return this._httpClient.post<DeletedItems[]>(this.restoreBulkProductUrl, data).pipe(
            tap(() => {
                this.showNotification('snackbar-success', 'Products restored successfully', 'bottom', 'center');
            }),
            catchError(err => this.handleError(err))
        );
    }

    getDeletedLeads(): Observable<DeletedItems[]> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        return this._httpClient.post<DeletedItems[]>(this.getDeletedLeadListUrl, data).pipe(
       
            catchError(err => this.handleError(err))
        );
    }
    restoreLead(lead: DeletedItems): Observable<any> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            leadId: lead.id
        };

        return this._httpClient.post<DeletedItems[]>(this.restoreLeadUrl, data).pipe(
         
            catchError(err => this.handleError(err))
        );
    }

    restoreBulkLeads(leadIds: number[]): Observable<any> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            leadId: leadIds
        };

        return this._httpClient.post<DeletedItems[]>(this.restoreBulkLeadUrl, data).pipe(
            tap(() => {
                this.showNotification('snackbar-success', 'Products restored successfully', 'bottom', 'center');
            }),
            catchError(err => this.handleError(err))
        );
    }


    getDeletedUsersList(): Observable<DeletedItems[]> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        return this._httpClient.post<DeletedItems[]>(this.getDeletedUsersUrl, data).pipe(
         
            catchError(err => this.handleError(err))
        );
    }

    restoreUser(userForm: DeletedItems): Observable<DeletedItems> {
        let data = {
            Id: this.user.id,
            tenantId: this.user.tenantId,
            userId: userForm.id
        };
        return this._httpClient.post<DeletedItems>(this.restoreUserListUrl, data).pipe(
            tap(() => {
                this.showNotification('snackbar-success', 'Product restored successfully', 'bottom', 'center');
            }),
            catchError(err => this.handleError(err))
        );
    }
    restoreBulkUsers(userIds: number[]): Observable<DeletedItems[]> {
        let data = {
            Id: this.user.id,
            tenantId: this.user.tenantId,
            userId: userIds
        };

        return this._httpClient.post<DeletedItems[]>(this.restoreBulkUserUrl, data).pipe(
            tap(() => {
                this.showNotification('snackbar-success', 'Products restored successfully', 'bottom', 'center');
            }),
            catchError(err => this.handleError(err))
        );
    }
}
