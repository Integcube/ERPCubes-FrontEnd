import { Route } from "@angular/router";
import { LeadsComponent } from "./leads.component";
import { LeadListComponent } from "./lead-list/lead-list.component";
import { LeadFormComponent } from "./lead-form/lead-form.component";
import { LeadsResolver } from "./leads.resolvers";

export const leadRoutes: Route[] = [
    {
        path: '',
        component: LeadsComponent,
        children: [{
            path: '',
            component: LeadListComponent,
            resolve:{
                leads:LeadsResolver
            },
            children: [
                {
                    path: ':id',
                    component: LeadFormComponent,
                }
            ]
        }]
    }
]