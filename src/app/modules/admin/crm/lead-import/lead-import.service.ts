import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';
import { Industry, Lead, LeadImportList, Product } from './lead-import.type';

@Injectable({
  providedIn: 'root'
})
export class LeadImportService {
  user: User;
  private readonly getUsersUrl = `${environment.url}/Users/all`
  private readonly saveBulkLeadUrl = `${environment.url}/Lead/bulkSave`
  private readonly getLeadListURL = `${environment.url}/Lead/all`
  private readonly getIndustriesURL = `${environment.url}/Industry/all`
  private readonly getProductUrl = `${environment.url}/Product/all`

  private _users: BehaviorSubject<User[] | null> = new BehaviorSubject(null)
  private _leads: BehaviorSubject<Lead[] | null> = new BehaviorSubject(null);
  private _industries: BehaviorSubject<Industry[] | null> = new BehaviorSubject(null);
  private _product: BehaviorSubject<Product[] | null> = new BehaviorSubject(null);

  constructor(
    private _userService: UserService,
    private _httpClient: HttpClient,
    private snackBar: MatSnackBar) 
  {
    this._userService.user$.subscribe(user => {
        this.user = user;
    })
  }
  get leads$(): Observable<Lead[]> {
    return this._leads.asObservable();
  }
  get industries$(): Observable<Industry[]> {
    return this._industries.asObservable();
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

  getLeads(): Observable<Lead[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<Lead[]>(this.getLeadListURL, data).pipe(
      tap((leads) => {
        this._leads.next(leads); // Update leads BehaviorSubject with the retrieved leads
      }),
      
    );

  }

  getProduct(): Observable<Product[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<Product[]>(this.getProductUrl, data).pipe(
      tap((product) => {
        this._product.next(product);
      }),
      

    );
  }

  getIndustries(): Observable<Industry[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<Industry[]>(this.getIndustriesURL, data).pipe(
      tap((industries) => {
        this._industries.next(industries);
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

  saveBulkImportLeads(leads: LeadImportList[]) {
    const data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      lead: leads
    };
    debugger;
    return this._httpClient.post<any>(this.saveBulkLeadUrl, data).pipe(
      tap(data => {
      })
    );
  }
}
