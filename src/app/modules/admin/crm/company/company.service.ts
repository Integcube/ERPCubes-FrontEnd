import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, catchError, combineLatest, map, of, switchMap, take, tap, throwError } from 'rxjs';
import { Company, CompanyCustomList, CompanyFilter, Industry } from './company.type';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { Call } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private readonly getcompanyListURL = `${environment.url}/Company/all`
  private readonly saveCompanyURL = `${environment.url}/Company/save`
  private readonly deleteCompanyURL = `${environment.url}/Company/delete`
  private readonly getIndustriesURL = `${environment.url}/Industry/all`
  private readonly getUsersUrl = `${environment.url}/Users/all`
  private readonly getCustomListUrl = `${environment.url}/CustomList/all`
  private readonly saveCustomListUrl = `${environment.url}/CustomList/save`
  private readonly deleteCustomListUrl = `${environment.url}/CustomList/delete`
  private readonly saveCustomListFilterUrl = `${environment.url}/CustomList/saveFilter`

  user: User;

  private _industries: BehaviorSubject<Industry[] | null> = new BehaviorSubject(null);
  private _company: BehaviorSubject<Company | null> = new BehaviorSubject(null);
  private _companies: BehaviorSubject<Company[] | null> = new BehaviorSubject(null);
  private _users: BehaviorSubject<User[] | null> = new BehaviorSubject(null);
  private _customLists: BehaviorSubject<CompanyCustomList[] | null> = new BehaviorSubject(null);
  private _customList: BehaviorSubject<CompanyCustomList | null> = new BehaviorSubject(null);
  private _filter: BehaviorSubject<CompanyFilter | null> = new BehaviorSubject(null);

  constructor(
    private _userService: UserService,
    private _httpClient: HttpClient,
  ) 
  {
    this._userService.user$.subscribe(user => {
      this.user = user;
    })
  }
  get filter$(): Observable<CompanyFilter> {
    return this._filter.asObservable();
  }
  get industries$():Observable<Industry[]>{
    return this._industries.asObservable();
  }
  get customLists$(): Observable<CompanyCustomList[]> {
    return this._customLists.asObservable();
  }
  get customList$(): Observable<CompanyCustomList> {
    return this._customList.asObservable();
  }
  get users$(): Observable<User[]> {
    return this._users.asObservable();
  }
  get company$(): Observable<Company> {
    return this._company.asObservable();
  }
  get companies$(): Observable<Company[]> {
    return this._companies.asObservable();
  }
  filteredCompanies$ = combineLatest(
    this.companies$,
    this.filter$
  ).pipe(
    map(([companies, filter]) => {
      return companies.filter(company => {
        let passFilter = true;
        if (filter.companyOwner.length > 0) {
          passFilter = passFilter && filter.companyOwner.includes(company.companyOwner);
        }
        if (filter.industryId.length > 0) {
          passFilter = passFilter && filter.industryId.includes(company.industryId);
        }
        if (filter.createdDate) {
          let c = new Date(filter.createdDate);
          passFilter = passFilter && c >= filter.createdDate;
        }
        if (filter.modifiedDate) {
          let d = new Date(filter.modifiedDate);
          passFilter = passFilter && d >= filter.modifiedDate;
        }
        return passFilter;
      })
    })
  )
  getIndustries(): Observable<Industry[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<Industry[]>(this.getIndustriesURL, data).pipe(
      tap((industries) => {
        this._industries.next(industries);
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
  getCustomList(): Observable<CompanyCustomList[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      type: "Company"
    }
    return this._httpClient.post<CompanyCustomList[]>(this.getCustomListUrl, data).pipe(
      map(data => {
        return data.map(d => {
          let filter = new CompanyFilter();
          if(d.filter){
            const jsonObject = JSON.parse(d.filter);
            ;
            filter = {
              companyOwner: jsonObject.companyOwner && jsonObject.companyOwner.length ? jsonObject.companyOwner : [],
              createdDate: jsonObject?.createdDate,
              modifiedDate: jsonObject?.modifiedDate,
              industryId: jsonObject.industryId && jsonObject.industryId.length ? jsonObject.industryId : [],
            };
          }
          return {
            ...d,
            filterParsed: filter
          } as CompanyCustomList;
        });
      }),
      tap((customList) => {
        this._customLists.next(customList);
      }),
      catchError(error => { alert(error); return EMPTY; })
    );
  }
  deleteCustomList(companyList: CompanyCustomList): Observable<CompanyCustomList> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      listId: companyList.listId,
      listTitle: companyList.listTitle,
    }
    return this._httpClient.post<CompanyCustomList>(this.deleteCustomListUrl, data).pipe(
      tap((customList) => {
        let list = new CompanyCustomList({});
        list.listTitle = "All Leads";
        this.setCustomList(list);
        this.getCustomList().subscribe();
      }),
      catchError(error => { alert(error); return EMPTY })
    );
  }
  setCustomList(list: CompanyCustomList){
    this._customList.next(list);
  }
  saveCustomList(companyList: CompanyCustomList): Observable<CompanyCustomList> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      listId: companyList.listId,
      listTitle: companyList.listTitle,
      filter: companyList.filter,
      isPublic: companyList.isPublic,
      type: "Company"
    }
    ;
    return this._httpClient.post<CompanyCustomList>(this.saveCustomListUrl, data).pipe(
      map(customList => {
        let filter = new CompanyFilter();
        if (customList.filter) {
          const jsonObject = JSON.parse(customList.filter);
          filter = {
            companyOwner: jsonObject.companyOwner && jsonObject.companyOwner.length ? jsonObject.companyOwner.split(',') : [],
            createdDate: jsonObject?.createdDate,
            modifiedDate: jsonObject?.modifiedDate,
            industryId: jsonObject.industryId && jsonObject.industryId.length ? jsonObject.industryId.split(', ').map(Number) : [],
          };
        }
        return {
          ...customList,
          filterParsed: new CompanyFilter()
        }
      }),
      tap((customList) => {
        this.setCustomList(customList)
        this.getCustomList().subscribe();
      }),
      catchError(error => { alert(error); return EMPTY })
    );
  }
  setFilter(filter: CompanyFilter){
    this._filter.next(filter);
  }
  saveCustomFilter(listId: number, listTitle: string, filter: string): Observable<any> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      listId,
      listTitle,
      filter
    }
    return this._httpClient.post<any>(this.saveCustomListFilterUrl, data).pipe(
      catchError(error => { alert(error); return EMPTY })
    );
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
