import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector       : 'file-manager',
    templateUrl    : './file-manager.component.html',
    
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileManagerComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
