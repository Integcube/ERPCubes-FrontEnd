import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector       : 'chat-empty-conversation',
    templateUrl    : './empty-conversation.component.html',
    
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyConversationComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
