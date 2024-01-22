import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ChatService } from '../chat.service';
import { Ticket } from '../chat.types';
import { User } from 'app/core/user/user.types';


@Component({
    selector       : 'chat-chats',
    templateUrl    : './chats.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatsComponent implements OnInit, OnDestroy
{
    user:User;
    tickets: Ticket[];
    drawerComponent: 'profile' | 'new-chat';
    drawerOpened: boolean = false;
    filteredTickets: Ticket[];
    selectedTicket: Ticket;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _chatService: ChatService,
        private _changeDetectorRef: ChangeDetectorRef
    )
    {
    }

    ngOnInit(): void {
        this.user = this._chatService.user;
        this._chatService.tickets$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((tickets: Ticket[]) => {
                this.tickets = this.filteredTickets = tickets;
                this._changeDetectorRef.markForCheck();
            });
        this._chatService.ticket$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((ticket: Ticket) => {
                this.selectedTicket = {...ticket};
                this._changeDetectorRef.markForCheck();
            });
            this.webSocket();

    }
    webSocket(){
        this._chatService.ticketListner();
    }

    ngOnDestroy(): void
    {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    filterChats(query: string): void
    {
        if ( !query )
        {
            this.filteredTickets = this.tickets;
            return;
        }

        this.filteredTickets = this.tickets.filter(chat => chat.customerId.toLowerCase().includes(query.toLowerCase()));
    }

    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
