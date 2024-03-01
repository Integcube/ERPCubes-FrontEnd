import { Routes } from "@angular/router";
import { WidgetComponent } from "./widget.component";
import { LeadsResolver } from "./widget.resolver";
import { TotalLeadsComponent } from "./lead/total-leads/total-leads.component";
import { LeadComponent } from "./lead/lead.component";

export const widgetsRoutes: Routes = [
    {
        path: '',
        component: WidgetComponent,

        children: [
            {
                path: 'id',
                component: LeadComponent,
                resolve: {
                    leads: LeadsResolver,
                },
            }
        ]
    },
];