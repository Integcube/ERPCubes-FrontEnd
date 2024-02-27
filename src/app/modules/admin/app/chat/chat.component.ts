import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector       : 'chat',
    templateUrl    : './chat.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
