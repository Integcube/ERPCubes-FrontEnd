import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, take, tap, throwError } from 'rxjs';
import { Opportunity, OpportunitySource } from './opportunity.types';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class OpportunityService {
  private readonly getOpportunityURL = `${environment.url}/Opportunity/all`
  private readonly saveOpportunityURL = `${environment.url}/Opportunity/save`
  private readonly deleteOpportunityURL = `${environment.url}/Opportunity/delete`
  private readonly getOpportunitySourceURL = `${environment.url}/Opportunity/allSource`
  private _opportunityList: BehaviorSubject<Opportunity[] | null> = new BehaviorSubject(null);
  private _opportunity: BehaviorSubject<Opportunity | null> = new BehaviorSubject(null);
  private _opportunitySource: BehaviorSubject<OpportunitySource[] | null> = new BehaviorSubject(null);
  user: User
  constructor(
    private _httpClient: HttpClient,
    private _userService: UserService,
    private snackBar: MatSnackBar
  )
  { this._userService.user$
    .subscribe(user =>
      this.user = user
    )
  }
  get opportunityList$(): Observable<Opportunity[]> {
    return this._opportunityList.asObservable();
  }
  get opportunity$(): Observable<Opportunity> {
    return this._opportunity.asObservable();
  }
  get opportunitySource$(): Observable<OpportunitySource[]> {
    return this._opportunitySource.asObservable();
  }
  getOpportunity(): Observable<Opportunity[]>{
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<Opportunity[]>(this.getOpportunityURL, data).pipe(
      tap((opportunity) => {
        this._opportunityList.next(opportunity)
      }),
      catchError(err=>this.handleError(err))
    )
  }
  getOpportunitySource(): Observable<OpportunitySource[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId
    }
    return this._httpClient.post<OpportunitySource[]>(this.getOpportunitySourceURL, data).pipe(
      tap((source) => {
        this._opportunitySource.next(source)
      }),
      catchError(err => this.handleError(err))
    )
  }
  saveOpportunity(opp: Opportunity) {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      ...opp
    }
    return this._httpClient.post<Opportunity[]>(this.saveOpportunityURL, data).pipe(
      tap((opportunity) => {
        this.getOpportunity().subscribe()
      }),
      catchError(err => this.handleError(err))
    )
  }
  deleteOpportunity(opp: Opportunity) {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      opportunityId: opp.opportunityId
    }
    return this._httpClient.post<Opportunity[]>(this.deleteOpportunityURL, data).pipe(
      tap((opportunity) => {
        this.getOpportunity().subscribe()
      }),
      catchError(err => this.handleError(err))
    )
  }
  selectedOpportunity(selectedOpportunity: Opportunity) {
    this._opportunity.next(selectedOpportunity);
  }
  getOpportunityId(id: number): Observable<Opportunity> {
    return this._opportunityList.pipe(
      take(1),
      map((opportunityList) => {
        if (id === -1) {
          const opportunity = new Opportunity({});
          this._opportunity.next(opportunity);
          return opportunity;
        }
        else {
          const opportunity = opportunityList.find(item => item.opportunityId === id) || null;
          this._opportunity.next(opportunity);
          return opportunity;
        }
      }),
      switchMap((opportunity) => {
        if (!opportunity) {
          return throwError('Could not find opportunity with id of ' + id + '!');
        }
        return of(opportunity);
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
