import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { Conversation, Ticket, TicketInfo, TicketPriority, TicketStatus, TicketType } from './chat.types';
import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private readonly getTicketsUrl = `${environment.url}/Ticket/allTickets`
    private readonly getUsersUrl = `${environment.url}/Users/all`
    private readonly getConversationsUrl = `${environment.url}/Ticket/allConversation`
    private readonly setReadStatusUrl = `${environment.url}/Ticket/setReadStatus`
    private readonly sendMessageUrl = `${environment.url}/Ticket/sendMessage`
    private readonly getTypeUrl = `${environment.url}/Ticket/getType`
    private readonly getPriorityUrl = `${environment.url}/Ticket/getPriority`
    private readonly getStatusUrl = `${environment.url}/Ticket/getStatus`
    private readonly saveInfoUrl = `${environment.url}/Ticket/saveInfo`

    private _ticketConnection: HubConnection;
    user: User;

    private _tickets: BehaviorSubject<Ticket[]> = new BehaviorSubject(null);
    private _ticket: BehaviorSubject<Ticket> = new BehaviorSubject(null);
    private _conversations: BehaviorSubject<Conversation[]> = new BehaviorSubject(null);
    private _conversation: BehaviorSubject<Conversation> = new BehaviorSubject(null);
    private _appUsers: BehaviorSubject<User[]> = new BehaviorSubject(null);
    private _type: BehaviorSubject<TicketType[]> = new BehaviorSubject(null);
    private _priority: BehaviorSubject<TicketPriority[]> = new BehaviorSubject(null);
    private _status: BehaviorSubject<TicketStatus[]> = new BehaviorSubject(null);

    constructor(
        private _userService: UserService,
        private _httpClient: HttpClient,
    ) {
        this.startConnection();
        this._userService.user$.subscribe(user => {
            this.user = user;
        })
    }
    private startConnection = () => {
        this._ticketConnection = new HubConnectionBuilder()
            .withUrl('https://localhost:7020/ticketHub', {
                transport: HttpTransportType.WebSockets,
                skipNegotiation: true
            })
            .build();

        this._ticketConnection
            .start()
            .then(() => {
                console.log('Connection started');
            })
            .catch((err) => {
                console.error('Error while starting connection: ' + err);
            });
    };
    public ticketListner = () => {
        this._ticketConnection.on('ReceiveNewTicket', (data) => {
            const currentTickets = this._tickets.getValue();
            let indexToRemove = currentTickets.findIndex(a => a.ticketId == data.ticketId);
            if (indexToRemove != -1) {
                currentTickets.splice(indexToRemove, 1);
            }
            const updatedTickets = [data, ...currentTickets];
            this._tickets.next(updatedTickets);
            const selectedTicket = this._ticket.getValue();
            if (selectedTicket.ticketId == data.ticketId) {
                const currentConversations = this._conversations.getValue();
                const updatedConversation = [...currentConversations, data.latestConversation];
                this._conversations.next(updatedConversation);
            }
        });
    };
    get users$():Observable<User[]>{
        return this._appUsers.asObservable();

    }
    get types$():Observable<TicketType[]>{
        return this._type.asObservable();

    }
    get priorities$():Observable<TicketPriority[]>{
        return this._priority.asObservable();

    }
    get statuses$():Observable<TicketStatus[]>{
        return this._status.asObservable();

    }
    get ticket$(): Observable<Ticket> {
        return this._ticket.asObservable();
    }
    get tickets$(): Observable<Ticket[]> {
        return this._tickets.asObservable();
    }
    get conversations$(): Observable<Conversation[]> {
        return this._conversations.asObservable();
    }
    get conversation$(): Observable<Conversation> {
        return this._conversation.asObservable();
    }
    selectTicket(ticket: Ticket) {
        this._ticket.next(ticket);
    }
    getTickets(): Observable<any> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        return this._httpClient.post<Ticket[]>(this.getTicketsUrl, data).pipe(
            tap((tickets) => {
                this._tickets.next(tickets);
            })
        )
    }
    getUsers(): Observable<any> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        return this._httpClient.post<User[]>(this.getUsersUrl, data).pipe(
            tap((users) => {
                this._appUsers.next(users);
            })
        )
    }
    setReadStatus(ticketId: number, status: boolean): Observable<any> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            ticketId: ticketId
        }
        return this._httpClient.post<Conversation[]>(this.setReadStatusUrl, data).pipe(
            tap((data) => {
                const currentTickets = this._tickets.getValue();
                let index = currentTickets.findIndex(a => a.ticketId == ticketId);
                currentTickets[index].latestConversation.readStatus = status;
                this._tickets.next(currentTickets);
            })
        )
    }
    getConversations(id: number): Observable<Conversation[]> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            ticketId: id
        }
        this.tickets$.pipe(
            map((tickets) => {
                const ticket = tickets.find(item => item.ticketId === id) || null;
                this._ticket.next(ticket);
            })
        ).subscribe();
        this.setReadStatus(id, true).subscribe();
        return this._httpClient.post<Conversation[]>(this.getConversationsUrl, data).pipe(
            map((conversations) => {
                this._conversations.next(conversations);
                return conversations;
            }),
            switchMap((conversations) => {
                if (!conversations) {
                    return throwError('Could not found chat with id of ' + id + '!');
                }
                return of(conversations);
            })
        );
    }
    sendMessage(ticket: Ticket): Observable<any> {
        let data = {
            id: this.user.id,
            ...ticket,
        }
        return this._httpClient.post<any>(this.sendMessageUrl, data)
    }
    getStatus():Observable<TicketStatus[]>{
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        return this._httpClient.post<TicketStatus[]>(this.getStatusUrl, data).pipe(
            tap(a=>this._status.next(a))
        )
    }
    getPriority():Observable<TicketPriority[]>{
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        return this._httpClient.post<TicketPriority[]>(this.getPriorityUrl, data).pipe(
            tap(a=>this._priority.next(a))
        )

    }
    getTypes():Observable<TicketType[]>{
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        return this._httpClient.post<TicketType[]>(this.getTypeUrl, data).pipe(
           tap(a=>this._type.next(a)) 
        )
    }
    saveTicketinfo(info: TicketInfo): Observable<TicketType[]> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            ...info
        }
        return this._httpClient.post<TicketType[]>(this.saveInfoUrl, data).pipe(
            tap(a => this.getTickets())
        )
    }
}
