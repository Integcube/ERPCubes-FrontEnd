import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertService } from 'app/core/alert/alert.service';
import { UserService } from 'app/core/user/user.service';
import { Pagination, PaginationView, User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Assign } from './assign-checklist.type';

@Injectable({
  providedIn: 'root'
})
export class AssignChecklistService {
private readonly getuListURL = `${environment.url}/CkCheckList/lazyall`
private readonly getcheckListURL = `${environment.url}/CkCheckList/getchecklist`
private readonly getcheckpointURL = `${environment.url}/CkCheckList/getcheckpoint`
private readonly getUsersUrl = `${environment.url}/Users/all`
private readonly SaveUrl = `${environment.url}/CkCheckList/assign`
private readonly deleteURL = `${environment.url}/CkCheckList/delete`
private readonly assigntolead = `${environment.url}/CkCheckList/assignTolead`


  user: User;
  private _user: BehaviorSubject<any | null> = new BehaviorSubject(null);
  private _paginationview: BehaviorSubject<PaginationView | null> = new BehaviorSubject<PaginationView | null>(new PaginationView({}));
  private _pagination: BehaviorSubject<Pagination | null> = new BehaviorSubject(null);
  private _AssignCheckList: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _checkList: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _checkpoint: BehaviorSubject<Assign[] | null> = new BehaviorSubject([]);
  private _users: BehaviorSubject<User[] | null> = new BehaviorSubject(null);

  constructor(
    private _userService: UserService,
    private _httpClient: HttpClient,
    private _alertService: AlertService
    ) 
  {
    this._userService.user$.subscribe(user => { this.user = user; })
  }
  
  get user$(): Observable<any> {
    return this._user.asObservable();
  }
  get AssignCheckList$(): Observable<any> {
    return this._AssignCheckList.asObservable();
  }

  get pagination$(): Observable<Pagination>
  {
      return this._pagination.asObservable();
  }
  get CheckList$(): Observable<any[]> {
    return this._checkList.asObservable();
  }
  get Checkpoint$(): Observable<Assign[]> {
    return this._checkpoint.asObservable();
  }

  get users$(): Observable<User[]> {
    return this._users.asObservable();
  }
  
  updatePaginationParam(pagination:PaginationView){
    this._paginationview.next(pagination);
  }


  getAssignCheckList(): Observable<{ paginationVm: Pagination;list: any[]}> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      page: '' + this._paginationview.value.pageIndex,
      size: '' + this._paginationview.value.pageSize,
      sort: this._paginationview.value.active,
      order:this._paginationview.value.direction,
      search:this._paginationview.value.search,
    }
    return this._httpClient.post<{ paginationVm: Pagination;list: any[]}>(this.getuListURL, data).pipe(
      tap((response) => {
        this._AssignCheckList.next(response.list);
        this._pagination.next(response.paginationVm);
      }),
    );
  }

  getCheckList(): Observable<any[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<any[]>(this.getcheckListURL, data).pipe(
      tap((response) => {
        this._checkList.next(response);
       
      }),
    );
  }

  getcheckpoint(clId:number,execId:number): Observable<Assign[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      clId:clId,
      execId:execId
    }
    return this._httpClient.post<Assign[]>(this.getcheckpointURL, data).pipe(
      tap((response) => {
        debugger
        this._checkpoint.next(response);
       
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

  assignCheckPoint(form: any,List:Assign[]) {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      cLId:form.clId,
      remarks:form.remarks,
      execId:form.execId,
      List,
    }
    return this._httpClient.post<Assign[]>(this.SaveUrl, data).pipe(
      tap((dashboard) => {
        this._alertService.showSuccess("CheckList Assigned Successfully");
         this.getAssignCheckList().subscribe();
      }),
    );
  }
  delete(execId: number): Observable<Assign> {
    let data = {
      id: this.user.id,
      tenantId:this.user.tenantId,
      execId: execId,
    }
    return this._httpClient.post<Assign>(this.deleteURL, data).pipe(
      tap((note) => {
        this.getAssignCheckList().subscribe();
      }),
      
    );
  }

  assignCheckPointToLeads(form: any) {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      cLId:form.clId,
      remarks:form.remarks,
      execId:form.execId,
    }
    return this._httpClient.post<any>(this.assigntolead, data).pipe(
      tap((data) => {
        this._alertService.showSuccess("CheckList Assigned Successfully to Leads");
      
      }),
    );
  }



}
