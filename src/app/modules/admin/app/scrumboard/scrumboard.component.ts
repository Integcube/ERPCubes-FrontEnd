import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector       : 'scrumboard',
    templateUrl    : './scrumboard.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrumboardComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
