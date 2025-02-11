import { Injectable } from "@angular/core";
import { User } from "app/core/user/user.types";
import { environment } from "environments/environment";
import { BehaviorSubject, Observable, tap} from "rxjs";
import { LeadReport, LeadStatus, Product } from "./lead-report.type";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { UserService } from "app/core/user/user.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
    providedIn: 'root'
})
export class LeadReportService {
    user: User;
    private readonly getUsersUrl = `${environment.url}/Users/all`
    private readonly getLeadStatusUrl = `${environment.url}/Lead/allStatus`
    private readonly getLeadReportUrl = `${environment.url}/Lead/leadReport`
    private readonly getProductUrl = `${environment.url}/Product/all`
    private _users: BehaviorSubject<User[] | null> = new BehaviorSubject(null)
    private _leadStatus: BehaviorSubject<LeadStatus[] | null> = new BehaviorSubject(null)
    private _leadReport: BehaviorSubject<LeadReport[] | null> = new BehaviorSubject(null)
    private _products: BehaviorSubject<Product[] | null> = new BehaviorSubject(null)
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
    getLeadReport(startDate: string, endDate: string, prodId: number): Observable<any> {
        let data : any = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            startDate: startDate,
            endDate: endDate,
            prodId: prodId
        }
        return this._httpClient.post<any>(this.getLeadReportUrl, data).pipe(
            tap((report) => {
                this._leadReport.next(report);
            }),
        );
    }
    getProducts(): Observable<Product[]> {
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

}