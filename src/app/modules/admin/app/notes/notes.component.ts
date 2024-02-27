import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector       : 'notes',
    templateUrl    : './notes.component.html',
    
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotesComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
