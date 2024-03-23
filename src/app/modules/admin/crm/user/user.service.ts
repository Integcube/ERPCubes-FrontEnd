import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'environments/environment';
import { UserForm } from './user.type';
import { UserService } from 'app/core/user/user.service';
import { User ,Pagination, PaginationView} from 'app/core/user/user.types';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertService } from 'app/core/alert/alert.service';


@Injectable({
  providedIn: 'root'
})
export class UserFormService {

  private readonly adduserListURL = `${environment.url}/Account/register`
  private readonly getuserListURL = `${environment.url}/Users/lazyall`
  private readonly updateUserURL = `${environment.url}/Account/Update`
  private readonly Deleteuser = `${environment.url}/Users/delete`

  user: User;
  private _user: BehaviorSubject<UserForm | null> = new BehaviorSubject(null);
  private _users: BehaviorSubject<UserForm[] | null> = new BehaviorSubject(null);
  private _pagination: BehaviorSubject<Pagination | null> = new BehaviorSubject(null);
  private _paginationview: BehaviorSubject<PaginationView | null> = new BehaviorSubject<PaginationView | null>(new PaginationView({}));

  constructor(
    private _userService: UserService,
    private _httpClient: HttpClient,
    private _alertService: AlertService
    ) 
  {
    this._userService.user$.subscribe(user => { this.user = user; })
  }
  
  get user$(): Observable<UserForm> {
    return this._user.asObservable();
  }
  get users$(): Observable<UserForm[]> {
    return this._users.asObservable();
  }
  get pagination$(): Observable<Pagination>
  {
      return this._pagination.asObservable();
  }
  getUsers(): Observable<{ paginationVm: Pagination;userList: UserForm[]}> {
    
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      page: '' + this._paginationview.value.pageIndex,
      size: '' + this._paginationview.value.pageSize,
      sort: this._paginationview.value.active,
      order:this._paginationview.value.direction,
      search:this._paginationview.value.search,
    }
    return this._httpClient.post<{ paginationVm: Pagination;userList: UserForm[]}>(this.getuserListURL, data).pipe(
      tap((response) => {
        this._users.next(response.userList);
        this._pagination.next(response.paginationVm);
      }),
    );
  }

  getUserById(id: any): Observable<UserForm> {

    return this._users.pipe(
      take(1),
      switchMap((users) => {
        const user = users.find(item => item.id === id) || null;
        if (!user) {

          const user = new UserForm({});
          this._user.next(user);
          return of(user);
        } else {

          this._user.next(user);
          return of(user);
        }
      }),
      switchMap((user) => {
        if (!user) {
          return throwError('Could not find user with id ' + id + '!');
        }
        return of(user);
      })
    );
  }

  saveUser(userId: any, user: FormGroup) {
    let data: UserForm = {
      id: userId,
      tenantId: this.user.tenantId,
      ...user.value
    }


    return this._httpClient.post<UserForm[]>(this.adduserListURL, data).pipe(
      tap((users) => {
        this._alertService.showSuccess("User Registered Successfully");
        // this.getUsers().subscribe();
      }),
      
    );
  }
  updatePaginationParam(pagination:PaginationView){
    this._paginationview.next(pagination);
  }
  updateUser(userId: any, user: FormGroup) {
    let data: UserForm = {
      Id: userId,
      tenantId: this.user.tenantId,
      userId: user.value.id,
      ...user.value
    }
    return this._httpClient.post<UserForm[]>(this.updateUserURL, data).pipe(
      tap((users) => {

        this.getUsers().subscribe();
      }),
      
    );
  }
  deleteUser(userForm: UserForm) {
    let data = {
      Id: this.user.id,
      tenantId: this.user.tenantId,
      userId :userForm.id
    }
    return this._httpClient.post<any>(this.Deleteuser, data).pipe(
      tap((companies) => {
       this.getUsers().subscribe();
      }),
      
    );
  }
  selectedUser(selectedUser: UserForm) {

    this._user.next(selectedUser);
  }


}