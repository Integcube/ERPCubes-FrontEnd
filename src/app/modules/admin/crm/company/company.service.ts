import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, switchMap, take, tap, throwError } from 'rxjs';
import { Company, Industry } from './company.type';
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
  private readonly deleteCompanyURL = `${environment.url}/Company/delete`
  private readonly getIndustriesURL = `${environment.url}/Industry/all`
  private readonly getUsersUrl = `${environment.url}/Users/all`

  user: User;

  private _Industries: BehaviorSubject<Industry[] | null> = new BehaviorSubject(null);
  private _company: BehaviorSubject<Company | null> = new BehaviorSubject(null);
  private _companies: BehaviorSubject<Company[] | null> = new BehaviorSubject(null);
  private _users: BehaviorSubject<User[] | null> = new BehaviorSubject(null);

  constructor(
    private _userService: UserService,
    private _httpClient: HttpClient,
  ) {
    this._userService.user$.subscribe(user => {
      this.user = user;
    })
  }
  get industries$():Observable<Industry[]>{
    return this._Industries.asObservable();
  }
  get users$():Observable<User[]>{
    return this._users.asObservable();
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
  getIndustries(): Observable<Industry[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<Industry[]>(this.getIndustriesURL, data).pipe(
      tap((industries) => {
        this._Industries.next(industries);
      })
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
      })
    );
  }
  saveCompany(company:Company){
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      company
    }
    return this._httpClient.post<Company[]>(this.saveCompanyURL, data).pipe(
      tap((companies) => {
        this.getCompanies().subscribe();
      })
    );
  }
  deleteCompany(company:Company){
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      companyId:company.companyId,
      name:company.name,
    }
    return this._httpClient.post<Company[]>(this.deleteCompanyURL, data).pipe(
      tap((company) => {
        this.getCompanies().subscribe();
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
