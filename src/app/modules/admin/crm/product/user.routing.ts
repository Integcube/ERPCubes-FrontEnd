import { Routes } from "@angular/router";
import { UserComponent } from "./user.component";
import { SelectedUserResolver, UsersResolver } from "./user.resolvers";
import { UserListComponent } from "./user-list/user-list.component";
import { UserFormComponent } from "./user-form/user-form.component";


export const userRoutes: Routes = [
    {
        path: '',
        component: UserComponent,
        resolve: {
            users: UsersResolver
        },
        children: [{
            path: '',
            component: UserListComponent,
            children: [
                {
                    path: ':id',
                    component: UserFormComponent,
                    resolve:{
                        selectedUser:SelectedUserResolver
                    },
                }
                
            ]
        }]
    }

];