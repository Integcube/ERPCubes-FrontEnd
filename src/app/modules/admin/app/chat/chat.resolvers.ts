import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { ChatService } from './chat.service';
import { Conversation, Ticket } from './chat.types';
import { User } from 'app/core/user/user.types';

@Injectable({
    providedIn: 'root'
})
export class TicketsResolver implements Resolve<any>
{
    constructor(
        private _chatService: ChatService,
        private _router: Router
    ) {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Ticket[]> | any {
        return this._chatService.getTickets();
    }
}
@Injectable({
    providedIn: 'root'
})
export class UsersResolver implements Resolve<any>
{
    constructor(
        private _chatService: ChatService,
        private _router: Router
    ) {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User[]> | any {
        return this._chatService.getUsers();
    }
}

@Injectable({
    providedIn: 'root'
})
export class UserResolver implements Resolve<any>{
    constructor(        private _chatService: ChatService,
        ) {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this._chatService.getUsers();
    }
}

@Injectable({
    providedIn: 'root'
})
export class ConversationsResolver implements Resolve<any>
{

    constructor(
        private _chatService: ChatService,
        private _router: Router
    )
    {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Conversation[]>
    {
        return this._chatService.getConversations(+route.paramMap.get('id'))
                   .pipe(
                       catchError((error) => {
                           console.error(error);
                           const parentUrl = state.url.split('/').slice(0, -1).join('/');
                           this._router.navigateByUrl(parentUrl);
                           return throwError(error);
                       })
                   );
    }
}



