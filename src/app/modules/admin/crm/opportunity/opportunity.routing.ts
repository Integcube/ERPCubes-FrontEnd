import { Routes } from "@angular/router";
import { OpportunityComponent } from "./opportunity.component";
import { OpportunityResolver, OpportunitySourceResolver } from "./opportunity.resolver";
import { OpportunityListComponent } from "./opportunity-list/opportunity-list.component";
import { OpportunityFormComponent } from "./opportunity-form/opportunity-form.component";

export const opportunityRoutes: Routes = [
    {
        path: '',
        component: OpportunityComponent,
        resolve: {
            opportunity:OpportunityResolver
        },
        children: [{
            path: '',
            component: OpportunityListComponent,
            children: [
                {
                    path: ':id',
                    component: OpportunityFormComponent,
                    resolve:{
                        opportunitySource: OpportunitySourceResolver
                    },
                
                }
                
            ]
        }]
    }

];