import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, switchMap, take, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { UserForm } from './user.type';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { FormGroup } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class UserFormService {

    private readonly adduserListURL = `${environment.url}/Account/register`
    private readonly getuserListURL = `${environment.url}/Users/all`
    private readonly updateUserURL = `${environment.url}/Users/update`
    // private readonly deleteCompanyURL = `${environment.url}/Company/save`

    user: User;
    private _user: BehaviorSubject<UserForm | null> = new BehaviorSubject(null);
    private _users: BehaviorSubject<UserForm[] | null> = new BehaviorSubject(null);

    constructor(
        private _userService: UserService,
        private _httpClient: HttpClient,
      ) {
        this._userService.user$.subscribe(user => {
          this.user = user;
        })
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
          })
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

      saveUser(userId: any, user:FormGroup){
        
        let data : UserForm= {
          id: userId,
          tenantId: this.user.tenantId,
          ...user.value
        }

          
        return this._httpClient.post<UserForm[]>(this.adduserListURL, data).pipe(
          tap((users) => {
            debugger
            // this.getUsers().subscribe();
          })
        );
      }
      
      updateUser(userId: any, user:FormGroup){
        
        let data : any= {
          tenantId: this.user.tenantId,
          firstName: user.value.firstName,
          lastName: user.value.lastName,
          userName: user.value.userName,
          email: user.value.email,
          phoneNumber: user.value.phoneNumber,
          password: user.value.password,
          id :userId
        }
        return this._httpClient.post<UserForm[]>(this.updateUserURL, data).pipe(
          tap((users) => {
            
            this.getUsers().subscribe();
          })
        );
      }
      deleteCompany(user:UserForm){
        let data = {
          id: this.user.id,
          tenantId: this.user.tenantId,
          ...user
        }
        return this._httpClient.post<UserForm[]>(this.updateUserURL, data).pipe(
          tap((companies) => {
            this.getUsers().subscribe();
          })
        );
      }
      selectedUser(selectedUser: UserForm) {
        
        this._user.next(selectedUser);
      }
}