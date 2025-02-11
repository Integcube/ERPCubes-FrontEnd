import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { environment } from 'environments/environment';
import { AuthModelResponse } from './auth.model';
import { User } from '../user/user.types';

@Injectable()
export class AuthService
{
    private _authenticated: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string)
    {
        if(token){
            localStorage.setItem('accessToken', token);
        }
    }

    get accessToken(): string
    {
        return localStorage.getItem('accessToken') ?? '';
    }

     /**
     * Setter & getter for email
     */
    get emailResponse():string{
        return localStorage.getItem('email') ?? '';
    }
    set emailResponse(email:string){
        localStorage.setItem('email', email);
    }
    /**
     * Setter & getter for userId
     */
    get userIdResponse():string{
        return localStorage.getItem('userId') ?? '';
    }
    set userIdResponse(userId:string){
        localStorage.setItem('userId', userId);
    }

      /**
     * Store complete Object is Local storage
     */
    get userObj(): string {
        return JSON.parse(localStorage.getItem('user'));
    }
    set userObj(data: any) {
        let user = data; 
        localStorage.setItem('user', JSON.stringify(user));
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any>
    {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any>
    {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string; subdomain:string; }): Observable<any>
    {
        // Throw error, if the user is already logged in
        if ( this._authenticated )
        {
            return throwError('User is already logged in.');
        }
        return this._httpClient.post(`${environment.url}/Account/authenticate`, credentials).pipe(
            switchMap((response: AuthModelResponse) => {
                // Store the access token in the local storage
                this.accessToken = response.token;
                this.emailResponse = response.email;
                this.userIdResponse = response.id;
                this.userObj = {...response}
                // Set the authenticated flag to true
                this._authenticated = true;
                // Store the user on the user service
                this._userService.user = {...response};
                // Return a new observable with the response
                return of(response);
            })
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any>
    {
        // Renew token
        return this._httpClient.post('api/auth/refresh-access-token', {
            accessToken: this.accessToken
        }).pipe(
            catchError((err) =>
              of(false)
  
                // Return false
              
            ),
            switchMap((response: any) => {
                // Store the access token in the local storage
                // this.accessToken = response.accessToken;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return true
                return of(true);
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any>
    {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('email');
        localStorage.removeItem('userId');
        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { name: string; email: string; password: string; company: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean>
    {
        // Check if the user is logged in
        if ( this._authenticated )
        {
            return of(true);
        }

        // Check the access token availability
        if ( !this.accessToken )
        {
            return of(false);
        }

        // Check the access token expire date
        if ( AuthUtils.isTokenExpired(this.accessToken) )
        {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }
}
