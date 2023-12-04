import { Route } from "@angular/router";
import { TasksDetailsComponent } from "./details/details.component";
import { TasksListComponent } from "./list/list.component";
import { TasksComponent } from "./tasks.component";
import { CanDeactivateTasksDetails } from "./tasks.guards";
import { SelectedTaskResolver, TaskTagsResolver, TasksResolver, UsersResolver, } from "./tasks.resolvers";

export const tasksRoutes: Route[] = [
    {
        path     : '',
        component: TasksComponent,
        resolve  : {
            tags: TaskTagsResolver
        },
        children : [
            {
                path     : '',
                component: TasksListComponent,
                resolve  : {
                    tasks: TasksResolver
                },
                children : [
                    {
                        path         : ':id',
                        component    : TasksDetailsComponent,
                        resolve      : {
                            task: SelectedTaskResolver,
                            user: UsersResolver
                        },
                        canDeactivate: [CanDeactivateTasksDetails]
                    }
                ]
            }
        ]
    }
];
