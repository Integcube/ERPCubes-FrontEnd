import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from 'environments/environment';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeletedLeads, DeletedProducts, DeletedUsers } from './trash.type';
import { Product } from '../product/product.type';
import { Lead } from '../lead/lead.type';

@Injectable({
    providedIn: 'root'
})
export class TrashService {
    private readonly getLeadListURL = `${environment.url}/Lead/all`
    private readonly getUserActivityURL = `${environment.url}/UserActivity/Get`
    private readonly getUsersUrl = `${environment.url}/Users/all`
    private readonly getDeletedProductList = `${environment.url}/Product/del`
    private readonly getRestoreBulkProductList = `${environment.url}/Product/restoreBulk`
    private readonly getRestoreProductList = `${environment.url}/Product/restore`
    private readonly getproductListURL = `${environment.url}/Product/all`
    private readonly getDeletedLeadList = `${environment.url}/Lead/allDeleted`
    private readonly getRestoreLeadList = `${environment.url}/Lead/restore`
    private readonly getRestoreBulkLeadList = `${environment.url}/Lead/restoreBulkLead`
    private readonly getDeletedUsers = `${environment.url}/Users/del`
    private readonly getRestoreUserList = `${environment.url}/Users/restore`
    private readonly getRestoreBulkUserList = `${environment.url}/Users/restoreBulkUser`





    private _deletedProducts: BehaviorSubject<DeletedProducts[] | null> = new BehaviorSubject(null);
    private _deletedLeads: BehaviorSubject<DeletedLeads[] | null> = new BehaviorSubject(null);
    private _products: BehaviorSubject<Product[] | null> = new BehaviorSubject(null);
    private _leads: BehaviorSubject<Lead[] | null> = new BehaviorSubject(null);
    private _users: BehaviorSubject<User[] | null> = new BehaviorSubject(null)
    private _deletedUsers: BehaviorSubject<DeletedUsers[] | null> = new BehaviorSubject(null);
    user: User;
    constructor(
        private _userService: UserService,
        private _httpClient: HttpClient,
        private snackBar: MatSnackBar) {
        this._userService.user$.subscribe(user => {
            this.user = user;
        })
    }
    get leads$(): Observable<Lead[]> {
        return this._leads.asObservable();
    }
    get deletedLeads$(): Observable<DeletedLeads[]> {
        return this._deletedLeads.asObservable();
    }
    get users$(): Observable<any> {
        return this._users.asObservable();
    }

    get deletedTrashProducts$(): Observable<DeletedProducts[]> {
        return this._deletedProducts.asObservable();
    }
    get deletedTrashUsers$(): Observable<DeletedUsers[]> {
        return this._deletedUsers.asObservable();
    }
    get products$(): Observable<Product[]> {
        return this._products.asObservable();
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
    getProducts(): Observable<Product[]> {

        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        return this._httpClient.post<Product[]>(this.getproductListURL, data).pipe(
            tap((products) => {
                this._products.next(products);
            }),
            catchError(err => this.handleError(err))
        );
    }

    getDeletedProducts(): Observable<DeletedProducts[]> {

        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        return this._httpClient.post<DeletedProducts[]>(this.getDeletedProductList, data).pipe(
            tap((products) => {
                this._deletedProducts.next(products);
            }),
            catchError(err => this.handleError(err))
        );
    }


    restoreProduct(product: DeletedProducts): Observable<any> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            productId: product.productId
        };

        return this._httpClient.post<DeletedProducts[]>(this.getRestoreProductList, data).pipe(
            tap(() => {
                this.showNotification('snackbar-success', 'Product restored successfully', 'bottom', 'center');
                // this.getDeletedProducts().subscribe();
            }),
            catchError(err => this.handleError(err))
        );
    }

    restoreBulkProduct(productIds: number[]): Observable<any> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            productId: productIds
        };

        return this._httpClient.post<DeletedProducts[]>(this.getRestoreBulkProductList, data).pipe(
            tap(() => {
                this.showNotification('snackbar-success', 'Products restored successfully', 'bottom', 'center');
                // this.getDeletedProducts().subscribe();
            }),
            catchError(err => this.handleError(err))
        );
    }

    getUsers(): Observable<User[]> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        return this._httpClient.post<User[]>(this.getUsersUrl, data).pipe(
            tap((users) => {
                this._users.next(users);
            }),
            catchError(err => this.handleError(err))

        );
    }

    getLeads(): Observable<Lead[]> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        return this._httpClient.post<Lead[]>(this.getLeadListURL, data).pipe(
            tap((leads) => {
                this._leads.next(leads);
            }),
            catchError(err => this.handleError(err))
        );
    }
    getDeletedLeads(): Observable<DeletedLeads[]> {

        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        return this._httpClient.post<DeletedLeads[]>(this.getDeletedLeadList, data).pipe(
            tap((leads) => {
                this._deletedLeads.next(leads);
            }),
            catchError(err => this.handleError(err))
        );
    }
    restoreLead(lead: DeletedLeads): Observable<any> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            leadId: lead.leadId
        };

        return this._httpClient.post<DeletedLeads[]>(this.getRestoreLeadList, data).pipe(
            tap(() => {
                this.showNotification('snackbar-success', 'Product restored successfully', 'bottom', 'center');
                // this.getDeletedLeads().subscribe();
            }),
            catchError(err => this.handleError(err))
        );
    }

    restoreBulkLeads(leadIds: number[]): Observable<any> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            leadId: leadIds
        };

        return this._httpClient.post<DeletedLeads[]>(this.getRestoreBulkLeadList, data).pipe(
            tap(() => {
                this.showNotification('snackbar-success', 'Products restored successfully', 'bottom', 'center');
                // this.getDeletedProducts().subscribe();
            }),
            catchError(err => this.handleError(err))
        );
    }


    getDeletedUsersList(): Observable<DeletedUsers[]> {

        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        return this._httpClient.post<DeletedUsers[]>(this.getDeletedUsers, data).pipe(
            tap((users) => {
                this._deletedUsers.next(users);
            }),
            catchError(err => this.handleError(err))
        );
    }

    restoreUser(userForm: DeletedUsers): Observable<any> {

        let data = {
            Id: this.user.id,
            tenantId: this.user.tenantId,
            userId: userForm.id
        };
        return this._httpClient.post<DeletedLeads[]>(this.getRestoreUserList, data).pipe(
            tap(() => {
                this.showNotification('snackbar-success', 'Product restored successfully', 'bottom', 'center');
                // this.getDeletedUsersList().subscribe();
            }),
            catchError(err => this.handleError(err))
        );
    }


    restoreBulkUsers(userIds: number[]): Observable<any> {
        let data = {
            Id: this.user.id,
            tenantId: this.user.tenantId,
            userId: userIds
        };

        return this._httpClient.post<DeletedLeads[]>(this.getRestoreBulkUserList, data).pipe(
            tap(() => {
                this.showNotification('snackbar-success', 'Products restored successfully', 'bottom', 'center');
                // this.getDeletedUsersList().subscribe();
            }),
            catchError(err => this.handleError(err))
        );
    }
}
