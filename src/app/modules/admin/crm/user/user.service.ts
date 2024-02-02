import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, take, tap, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'environments/environment';
import { UserForm } from './user.type';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class UserFormService {

  private readonly adduserListURL = `${environment.url}/Account/register`
  private readonly getuserListURL = `${environment.url}/Users/all`
  private readonly updateUserURL = `${environment.url}/Account/Update`
  private readonly Deleteuser = `${environment.url}/Users/delete`

  user: User;
  private _user: BehaviorSubject<UserForm | null> = new BehaviorSubject(null);
  private _users: BehaviorSubject<UserForm[] | null> = new BehaviorSubject(null);

  constructor(
    private _userService: UserService,
    private _httpClient: HttpClient,
    private snackBar: MatSnackBar) {
    this._userService.user$.subscribe(user => { this.user = user; })
  }

  get user$(): Observable<UserForm> {
    return this._user.asObservable();
  }
  get users$(): Observable<UserForm[]> {
    return this._users.asObservable();
  }

  getUsers(): Observable<UserForm[]> {

    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    debugger
    return this._httpClient.post<UserForm[]>(this.getuserListURL, data).pipe(
      tap((users) => {
        this._users.next(users);
      }),
      catchError(err => this.handleError(err))
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
        // this.getUsers().subscribe();
      }),
      catchError(err => this.handleError(err))
    );
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
      catchError(err => this.handleError(err))
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
      catchError(err => this.handleError(err))
    );
  }
  selectedUser(selectedUser: UserForm) {

    this._user.next(selectedUser);
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    debugger;
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    }

    else {
      errorMessage = errorMessage = err.error;

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