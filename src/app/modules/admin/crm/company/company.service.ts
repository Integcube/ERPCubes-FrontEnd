import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, switchMap, take, tap, throwError } from 'rxjs';
import { Company } from './company.type';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private readonly getcompanyListURL = `${environment.url}/Company/all`
  private readonly saveCompanyURL = `${environment.url}/Company/save`
  private readonly deleteCompanyURL = `${environment.url}/Company/save`

  user: User;
  private _company: BehaviorSubject<Company | null> = new BehaviorSubject(null);
  private _companies: BehaviorSubject<Company[] | null> = new BehaviorSubject(null);

  constructor(
    private _userService: UserService,
    private _httpClient: HttpClient,
  ) {
    this._userService.user$.subscribe(user => {
      this.user = user;
    })
  }
  get company$(): Observable<Company> {
    return this._company.asObservable();
  }
  get companies$(): Observable<Company[]> {
    return this._companies.asObservable();
  }
  getCompanies(): Observable<Company[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<Company[]>(this.getcompanyListURL, data).pipe(
      tap((companies) => {
        this._companies.next(companies);
      })
    );
  }
  saveCompany(company:Company){
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      ...company
    }
    return this._httpClient.post<Company[]>(this.saveCompanyURL, data).pipe(
      tap((companies) => {
        this.getCompanies();
      })
    );
  }
  deleteCompany(company:Company){
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      ...company
    }
    return this._httpClient.post<Company[]>(this.saveCompanyURL, data).pipe(
      tap((companies) => {
        this.getCompanies();
      })
    );
  }
  selectedCompany(selectedCompany: Company) {
    this._company.next(selectedCompany);
  }
  getCompanyById(id: number): Observable<Company> {
    return this._companies.pipe(
      take(1),
      map((companies) => {
        if (id === -1) {
          const company = new Company({});
          this._company.next(company);
          return company;
        }
        else {
          const company = companies.find(item => item.companyId === id) || null;
          this._company.next(company);
          return company;
        }
      }),
      switchMap((company) => {
        if (!company) {
          return throwError('Could not found task with id of ' + id + '!');
        }
        return of(company);
      })
    );
  }
}
