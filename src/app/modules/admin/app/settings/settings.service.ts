import { Injectable } from "@angular/core";
import { Chatbot} from "./settings.type";
import { BehaviorSubject, EMPTY, Observable, catchError, map, of, switchMap, take, tap, throwError } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { UserService } from "app/core/user/user.service";
import { User } from "app/core/user/user.types";
import { environment } from "environments/environment";
import { ActivatedRoute } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
   
    private readonly saveFormURL = `${environment.url}/CrmSetting/savechatbot`
    private readonly getChatbotSettingURL = `${environment.url}/CrmSetting/getchatbotsetting`
    private _form: BehaviorSubject<Chatbot | null> = new BehaviorSubject(null);

    user: User
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
        private _route: ActivatedRoute,
        private snackBar: MatSnackBar)
    {
        this._userService.user$.subscribe(user => this.user = user)
    }
   
 
    get Chatbot$(): Observable<Chatbot> {
        return this._form.asObservable();
    }

    getChatbotSetting(): Observable<any> {
        let data = {
          tenantId: this.user.tenantId,
        };
        return this._httpClient.post<any>(this.getChatbotSettingURL, data).pipe(
          catchError(err => this.handleError(err))
        );
      }
   
    saveForm(chatbot: Chatbot): Observable<any> {
        chatbot.userId=this.user.id
        chatbot.tenantId=this.user.tenantId;
        
        return this._httpClient.post<any>(this.saveFormURL, chatbot)
        .pipe(
            tap(form => {
               
                
            }),
            catchError(err => this.handleError(err))

        )
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
}