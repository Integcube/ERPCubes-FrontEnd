import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector       : 'tasks',
    templateUrl    : './tasks.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksComponent
{
    constructor()
    {
    }
}
