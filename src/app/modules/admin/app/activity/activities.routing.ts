import { Route } from '@angular/router';
import { ActivitiesComponent } from './activities.component';
import { ActivitiesResolver, UserResolver } from './activities.resolvers';


export const activitiesRoutes: Route[] = [
    {
        path     : '',
        component: ActivitiesComponent,
        resolve  : {
            activities: ActivitiesResolver,
            users: UserResolver
        }
    }
];
