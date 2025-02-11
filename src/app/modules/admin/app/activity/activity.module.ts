import { ChangeDetectorRef, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'app/shared/shared.module';
import { ActivitiesComponent } from './activities.component';
import { activitiesRoutes } from './activities.routing';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';


@NgModule({
    declarations: [
        ActivitiesComponent
    ],
    imports     : [
        RouterModule.forChild(activitiesRoutes),
        FuseScrollbarModule,
        MatIconModule,
        SharedModule
    ]
})
export class ActivitiesModule
{
}