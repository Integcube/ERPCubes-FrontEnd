import { Route } from '@angular/router';
import { TrashComponent } from './trash.component';
// import { ProductTrashResolver, UserResolver } from './trash.resolvers';


export const trashRoutes: Route[] = [
    {
        path     : '',
        component: TrashComponent,
        resolve  : {
            // ProductTrash: ProductTrashResolver,
            // users: UserResolver
        }
    }
];
