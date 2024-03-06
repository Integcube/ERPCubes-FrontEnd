import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TotalLeadCount, TotalLeadMonth, TotalLeadOwner, TotalLeadSource, TotalLeadSummary, TotalLostCount, TotalNewCount, TotalQualifiedCount, TotalWonCount } from './widget.type';



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

    

    // private _leadTotalCount: BehaviorSubject<TotalLeadCount[] | null> = new BehaviorSubject(null)

    user: User;
    // private _leads: BehaviorSubject<Lead[] | null> = new BehaviorSubject(null);

    constructor(
      private _httpClient: HttpClient,
      private _userService: UserService,
      private snackBar: MatSnackBar) 
    {
        this._userService.user$.subscribe(user => {
            this.user = user;
        })
    }

    getTotalLead(): Observable<TotalLeadCount> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        debugger;
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
