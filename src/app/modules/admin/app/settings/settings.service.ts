import { Injectable } from "@angular/core";
import { Chatbot} from "./settings.type";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";
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
          
        );
      }
   
    saveForm(chatbot: Chatbot): Observable<any> {
        chatbot.userId=this.user.id
        chatbot.tenantId=this.user.tenantId;
        
        return this._httpClient.post<any>(this.saveFormURL, chatbot)
        .pipe(
            tap(form => {
               
                
            }),
            

        )
    }
}