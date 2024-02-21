import { Injectable } from "@angular/core";
import { User } from "app/core/user/user.types";
import { environment } from "environments/environment";
import { BehaviorSubject,EMPTY, Observable, tap, throwError } from "rxjs";
import { LeadReport, LeadStatus, Product,LeadSource,LeadPipelineFilter } from "./campaig-effectiveness.type";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { UserService } from "app/core/user/user.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
    providedIn: 'root'
})
export class CampaigEffectivenessService {
    user: User;
    private readonly getUsersUrl = `${environment.url}/Users/all`
    private readonly getLeadStatusUrl = `${environment.url}/Lead/allStatus`
    private readonly getLeadReportUrl = `${environment.url}/CRMReports/GetCampaigWiseReport`
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
            
        );
    }


    getLeadReport(obj:LeadPipelineFilter): Observable<LeadReport[]> {
        obj.tenantId =this.user.tenantId;
      debugger
        return this._httpClient.post<LeadReport[]>(this.getLeadReportUrl, obj).pipe(
            tap((report) => {
                this._leadReport.next(report);
            }),
        );
    }
}