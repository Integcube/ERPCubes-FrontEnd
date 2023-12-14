import { Routes } from "@angular/router";
import { CrmDashboardComponent } from "./crm-dashboard.component";
import { LeadsResolver, TaskResolver, UserResolver } from "./crm-dashboard.resolver";

export const CrmDashboardRouting: Routes = [
    {
        path: '',
        component: CrmDashboardComponent,
        resolve: {
            users: UserResolver,
            leads: LeadsResolver,
            tasks: TaskResolver
        }
    },
];