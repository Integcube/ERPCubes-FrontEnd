import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Count, Filter, TotalLeadMonth, TotalLeadOwner, TotalLeadSource, TotalLeadSummary } from './widget.type';



@Injectable({
    providedIn: 'root'
})
export class WidgetService {
    private readonly getTotalLeadUrl = `${environment.url}/Lead/leadCountByTotal`
    private readonly getMonthLeadUrl = `${environment.url}/Lead/leadCountByMonth`
    private readonly getSourceLeadUrl = `${environment.url}/Lead/leadCountBySource`
    private readonly getOwnerLeadUrl = `${environment.url}/Lead/leadCountByOwner`
    private readonly getSummaryLeadUrl = `${environment.url}/Lead/leadCountSummary`

    
    user: User;

    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
        private snackBar: MatSnackBar) {
        this._userService.user$.subscribe(user => {
            this.user = user;
        })
    }

    getTotalLead(data: Filter): Observable<Count> {
 
        data.tenantId=this.user.tenantId
        return this._httpClient.post<Count>(this.getTotalLeadUrl, data).pipe(
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
  
}
