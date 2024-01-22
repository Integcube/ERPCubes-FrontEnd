import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Chat } from 'app/layout/common/quick-chat/quick-chat.types';
import { Subject, takeUntil } from 'rxjs';
import { ChatService } from '../chat.service';
import { Ticket } from '../chat.types';

@Component({
    selector: 'chat-contact-info',
    templateUrl: './contact-info.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactInfoComponent implements OnInit, OnDestroy {
    ticket: Ticket;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @Input() drawer: MatDrawer;

    constructor(private _chatService: ChatService,
        private _changeDetectorRef: ChangeDetectorRef,

    ) {
    }
    ngOnInit(): void {
        this._chatService.ticket$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((ticket: Ticket) => {
                this.ticket = ticket;
                this._changeDetectorRef.markForCheck();
            });
    }
    ngOnDestroy(): void {
        throw new Error('Method not implemented.');
    }
}
