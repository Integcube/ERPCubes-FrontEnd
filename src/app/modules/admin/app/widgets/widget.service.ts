import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LostCountFilter, NewCountFilter, QualifiedCountFilter, TodayLost, TodayNew, TodayQualified, TodayWon, TotalCountFilter, TotalLeadCount, TotalLeadMonth, TotalLeadOwner, TotalLeadSource, TotalLeadSummary, TotalLostCount, TotalNewCount, TotalQualifiedCount, TotalWonCount, WonCountFilter } from './widget.type';



@Injectable({
    providedIn: 'root'
})
export class WidgetService {
    private readonly getTotalLeadUrl = `${environment.url}/Lead/leadCountByTotal`
    private readonly getWonLeadUrl = `${environment.url}/Lead/leadCountByWon`
    private readonly getNewLeadUrl = `${environment.url}/Lead/leadCountByNew`
    private readonly getQualifiedLeadUrl = `${environment.url}/Lead/leadCountByQualified`
    private readonly getLostLeadUrl = `${environment.url}/Lead/leadCountByLost`
    private readonly getMonthLeadUrl = `${environment.url}/Lead/leadCountByMonth`
    private readonly getSourceLeadUrl = `${environment.url}/Lead/leadCountBySource`
    private readonly getOwnerLeadUrl = `${environment.url}/Lead/leadCountByOwner`
    private readonly getSummaryLeadUrl = `${environment.url}/Lead/leadCountSummary`
    private readonly getTotalCountFilterUrl = `${environment.url}/Lead/totalCountFilter`
    private readonly getNewCountFilterUrl = `${environment.url}/Lead/newCountFilter`
    private readonly getQualifiedCountFilterUrl = `${environment.url}/Lead/qualifiedCountFilter`
    private readonly getLostCountFilterUrl = `${environment.url}/Lead/lostCountFilter`
    private readonly getWonCountFilterUrl = `${environment.url}/Lead/wonCountFilter`
    private readonly getTodayLostUrl = `${environment.url}/Lead/lostTodayFilter`
    private readonly getTodayNewUrl = `${environment.url}/Lead/newTodayFilter`
    private readonly getTodayQualifiedUrl = `${environment.url}/Lead/qualifiedTodayFilter`
    private readonly getTodayWonUrl = `${environment.url}/Lead/wonTodayFilter`

    
    user: User;

    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
        private snackBar: MatSnackBar) {
        this._userService.user$.subscribe(user => {
            this.user = user;
        })
    }

    getTotalLead(): Observable<TotalLeadCount> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        return this._httpClient.post<TotalLeadCount>(this.getTotalLeadUrl, data).pipe(
        );
    }

    getWonLead(): Observable<TotalWonCount> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        return this._httpClient.post<TotalWonCount>(this.getWonLeadUrl, data).pipe(
        );
    }

    getNewLead(): Observable<TotalNewCount> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        return this._httpClient.post<TotalNewCount>(this.getNewLeadUrl, data).pipe(
        );
    }

    getQualifiedLead(): Observable<TotalQualifiedCount> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        return this._httpClient.post<TotalQualifiedCount>(this.getQualifiedLeadUrl, data).pipe(
        );
    }

    getLostLead(): Observable<TotalLostCount> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        return this._httpClient.post<TotalLostCount>(this.getLostLeadUrl, data).pipe(
        );
    }

    getSourceLead(): Observable<TotalLeadSource[]> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        return this._httpClient.post<TotalLeadSource[]>(this.getSourceLeadUrl, data).pipe(
        );
    }
    getMonthLead(): Observable<TotalLeadMonth[]> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        return this._httpClient.post<TotalLeadMonth[]>(this.getMonthLeadUrl, data).pipe(
        );
    }
    getOwnerLead(): Observable<TotalLeadOwner[]> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        return this._httpClient.post<TotalLeadOwner[]>(this.getOwnerLeadUrl, data).pipe(
        );
    }
    getSummaryLead(): Observable<TotalLeadSummary> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        return this._httpClient.post<TotalLeadSummary>(this.getSummaryLeadUrl, data).pipe(
        );
    }
    getTotalCountFilter(daysAgo: number): Observable<TotalCountFilter> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            daysAgo: daysAgo
        }
        return this._httpClient.post<TotalCountFilter>(this.getTotalCountFilterUrl, data).pipe(
        );
    }
    
    getNewCountFilter(daysAgo: number): Observable<NewCountFilter> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            daysAgo: daysAgo
        }
        return this._httpClient.post<NewCountFilter>(this.getNewCountFilterUrl, data).pipe(
        );
    }
    getQualifiedCountFilter(daysAgo: number): Observable<QualifiedCountFilter> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            daysAgo: daysAgo
        }
        return this._httpClient.post<QualifiedCountFilter>(this.getQualifiedCountFilterUrl, data).pipe(
        );
    }
    getLostCountFilter(daysAgo: number): Observable<LostCountFilter> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            daysAgo: daysAgo
        }
        return this._httpClient.post<LostCountFilter>(this.getLostCountFilterUrl, data).pipe(
        );
    }
    getWonCountFilter(daysAgo: number): Observable<WonCountFilter> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            daysAgo: daysAgo
        }
        return this._httpClient.post<WonCountFilter>(this.getWonCountFilterUrl, data).pipe(
        );
    }
    getTodayLost(): Observable<TodayLost> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        return this._httpClient.post<TodayLost>(this.getTodayLostUrl, data).pipe(
        );
    }
    getTodayNew(): Observable<TodayNew> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        return this._httpClient.post<TodayNew>(this.getTodayNewUrl, data).pipe(
        );
    }
    getTodayQualified(): Observable<TodayQualified> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        return this._httpClient.post<TodayQualified>(this.getTodayQualifiedUrl, data).pipe(
        );
    }
    getTodayWon(): Observable<TodayWon> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        return this._httpClient.post<TodayWon>(this.getTodayWonUrl, data).pipe(
        );
    }
    
  
}
