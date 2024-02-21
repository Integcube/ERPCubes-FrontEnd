import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LeadMonthly, LeadMonthlyFilter, LeadSource, Product,  } from './lead-monthly.type';

@Injectable({
  providedIn: 'root'
})
export class LeadMonthlyService {
  user: User;
  private readonly getUsersURL = `${environment.url}/Users/all`
  private readonly getProductsURL = `${environment.url}/Product/all`
  private readonly getLeadSourceURL = `${environment.url}/Lead/allSource`
  private readonly getLeadMonthlyURL = `${environment.url}/Lead/leadByMonth`
  private _users: BehaviorSubject<User[] | null> = new BehaviorSubject(null)
  private _products: BehaviorSubject<Product[] | null> = new BehaviorSubject(null)
  private _leadSources: BehaviorSubject<LeadSource[] | null> = new BehaviorSubject(null)
  private _leadMonthly: BehaviorSubject<LeadMonthly[] | null> = new BehaviorSubject(null)
  constructor(
    private _userService: UserService,
    private _httpClient: HttpClient,
    ) 
  {
    this._userService.user$.subscribe(user => {
        this.user = user;
    })
  }
  get leadMonthly$(): Observable<LeadMonthly[]> {
    return this._leadMonthly.asObservable()
  }
  get users$(): Observable<User[]> {
    return this._users.asObservable()
  }
  get products$(): Observable<Product[]> {
    return this._products.asObservable()
  }
  get leadSources$(): Observable<LeadSource[]> {
    return this._leadSources.asObservable()
  }
  getLeadMonthly(filter: LeadMonthlyFilter): Observable<LeadMonthly[]> {
    let data = {
      ...filter,
      tenantId : this.user.tenantId,
      year : filter.year.getFullYear().toString()
    }
    return this._httpClient.post<LeadMonthly[]>(this.getLeadMonthlyURL, data).pipe(
        tap((report) => {
            this._leadMonthly.next(report);
        }),
        
    );
  }
  getUsers(): Observable<User[]> {
    let data = {
        id: this.user.id,
        tenantId: this.user.tenantId,
    }
    return this._httpClient.post<User[]>(this.getUsersURL, data).pipe(
        tap((users) => {
            this._users.next(users);
        }),
        
    );
  }
  getProducts(): Observable<Product[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<Product[]>(this.getProductsURL, data).pipe(
      tap((product) => {
        this._products.next(product);
      }),
      
    );
  }
  getLeadSource(): Observable<LeadSource[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<LeadSource[]>(this.getLeadSourceURL, data).pipe(
      tap((leadSource) => {
        this._leadSources.next(leadSource);
      }),
      
    );
  }
  
}
