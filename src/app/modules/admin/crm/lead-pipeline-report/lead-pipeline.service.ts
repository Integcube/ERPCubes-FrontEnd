import { Injectable } from "@angular/core";
import { User } from "app/core/user/user.types";
import { environment } from "environments/environment";
import { BehaviorSubject,EMPTY, Observable, catchError, tap, throwError } from "rxjs";
import { LeadReport, LeadStatus, Product,LeadSource,LeadPipelineFilter } from "./lead-Pipeline.type";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { UserService } from "app/core/user/user.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
    providedIn: 'root'
})
export class leadPipelineService {
    user: User;
    private readonly getUsersUrl = `${environment.url}/Users/all`
    private readonly getLeadStatusUrl = `${environment.url}/Lead/allStatus`
    private readonly getLeadReportUrl = `${environment.url}/Lead/leadPiplineReport`
    private readonly getProductUrl = `${environment.url}/Product/all`
    private readonly getLeadSourceUrl = `${environment.url}/Lead/allSource`

    private _users: BehaviorSubject<User[] | null> = new BehaviorSubject(null)
    private _leadStatus: BehaviorSubject<LeadStatus[] | null> = new BehaviorSubject(null)
    private _leadReport: BehaviorSubject<LeadReport[] | null> = new BehaviorSubject(null)
    private _products: BehaviorSubject<Product[] | null> = new BehaviorSubject(null)
    private _leadSource: BehaviorSubject<LeadSource[] | null> = new BehaviorSubject(null)
    
    constructor(
        private _userService: UserService,
        private _httpClient: HttpClient,
        private snackBar: MatSnackBar
    ) {
        this._userService.user$.subscribe(user => {
            this.user = user;
        })
    }
    get prodcts$(): Observable<Product[]> {
        return this._products.asObservable()
    }
    get users$(): Observable<User[]> {
        return this._users.asObservable()
    }
    get leadStatus$(): Observable<LeadStatus[]> {
        return this._leadStatus.asObservable()
    }
    get leadReport$(): Observable<LeadReport[]> {
        return this._leadReport.asObservable()
    }

    get leadSource$(): Observable<LeadSource[]> {
        return this._leadSource.asObservable();
      }

    getProducts(): Observable<Product[]> {
        debugger
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        return this._httpClient.post<Product[]>(this.getProductUrl, data).pipe(
            tap((product) => {
             
                this._products.next(product);
            }),
            catchError(err=>this.handleError(err))
        );
    }
    getLeadStatus(): Observable<LeadStatus[]> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        return this._httpClient.post<LeadStatus[]>(this.getLeadStatusUrl, data).pipe(
            tap((status) => {
                this._leadStatus.next(status);
            }),
            catchError(err=>this.handleError(err))
        );
    }

    getLeadSource(): Observable<LeadSource[]> {
        let data = {
          id: this.user.id,
          tenantId: this.user.tenantId,
        }
        return this._httpClient.post<LeadSource[]>(this.getLeadSourceUrl, data).pipe(
          tap((leadSource) => {
            this._leadSource.next(leadSource);
          }),
          catchError(error => { alert(error); return EMPTY })
    
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
            catchError(err=>this.handleError(err))
        );
    }


    getLeadReport(obj:LeadPipelineFilter): Observable<LeadReport[]> {
        obj.tenantId =this.user.tenantId;
        return this._httpClient.post<LeadReport[]>(this.getLeadReportUrl, obj).pipe(
            tap((report) => {
                this._leadReport.next(report);
            }),
            catchError(err => {
                console.error('Error in getLeadReport:', err);
                return this.handleError(err);
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