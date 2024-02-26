import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ChatService } from '../chat.service';
import { Conversation, Ticket } from '../chat.types';


@Component({
    selector       : 'chat-conversation',
    templateUrl    : './conversation.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConversationComponent implements OnInit, OnDestroy
 {
    @ViewChild('messageInput') messageInput: ElementRef;
    coversations: Conversation[];
    ticket:Ticket;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _chatService: ChatService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _ngZone: NgZone,

    )
    {
    }

    @HostListener('input')
    @HostListener('ngModelChange')
    private _resizeMessageInput(): void
    {
        this._ngZone.runOutsideAngular(() => {

            setTimeout(() => {

                this.messageInput.nativeElement.style.height = 'auto';

                // Detect the changes so the height is applied
                this._changeDetectorRef.detectChanges();

                // Get the scrollHeight and subtract the vertical padding
                this.messageInput.nativeElement.style.height = `${this.messageInput.nativeElement.scrollHeight}px`;

                // Detect the changes one more time to apply the final height
                this._changeDetectorRef.detectChanges();
            });
        });
    }


    ngOnInit(): void
    {
        this._chatService.conversations$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((chat: Conversation[]) => {
                this.coversations = chat;
                this._changeDetectorRef.markForCheck();
            });
            this._chatService.ticket$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((ticket: Ticket) => {
                this.ticket = ticket;
                this._changeDetectorRef.markForCheck();
            });
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {
                if ( matchingAliases.includes('lg') )
                {
                    this.drawerMode = 'side';
                }
                else
                {
                    this.drawerMode = 'over';
                }
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    sendMessage() 
    {
      let message =  this.messageInput.nativeElement.value.trim();
      if(message) {  
        let conversation:Conversation = new Conversation({});
        conversation.ticketId =this.ticket.ticketId;
        conversation.messageBody= message;
        conversation.isMine = true;
        conversation.readStatus = true;
        conversation.tenantId = this.ticket.tenantId;
        this.ticket.latestConversation = {...conversation}
        this._chatService.sendMessage(this.ticket).pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
            data=>{
                this.messageInput.nativeElement.value = '';
                this._changeDetectorRef.markForCheck();
            }
        );
      }
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Open the contact info
     */
    openContactInfo(): void
    {
        // Open the drawer
        this.drawerOpened = true;

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Reset the chat
     */
    resetChat(): void
    {
        //this._chatService.resetChat();
        // Close the contact info in case it's opened
        this.drawerOpened = false;

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Toggle mute notifications
     */
    toggleMuteNotifications(): void
    {
        // // Toggle the muted
        // this.chat.muted = !this.chat.muted;

        // // Update the chat on the server
        // this._chatService.updateChat(this.chat.id, this.chat).subscribe();
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
