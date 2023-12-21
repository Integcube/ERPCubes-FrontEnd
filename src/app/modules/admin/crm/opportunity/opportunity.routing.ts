import { Routes } from "@angular/router";
import { OpportunityComponent } from "./opportunity.component";
import { CallResolver, CustomListResolver, EmailResolver, IndustryResolver, MeetingResolver, NoteResolver, OpportunityResolver, OpportunitySourceResolver, OpportunityStatusResolver, ProductResolver, SelectedOpportunityResolver, TagsResolver, TaskResolver, UserResolver } from "./opportunity.resolver";
import { OpportunityListComponent } from "./opportunity-list/opportunity-list.component";
import { OpportunityFormComponent } from "./opportunity-form/opportunity-form.component";
import { OpportunityDetailComponent } from "./opportunity-detail/opportunity-detail.component";
import { OpportunityGuard } from "./opportunity.guard";

export const opportunityRoutes: Routes = [
    {
        path: '',
        component: OpportunityComponent,
        resolve: {
            opportunity:OpportunityResolver,
            industries: IndustryResolver,
            users: UserResolver,
            opportunitySource: OpportunitySourceResolver,
            opportunityStatus: OpportunityStatusResolver,
            product: ProductResolver,
            customList: CustomListResolver
        },
        children: [
            {
                path: '',
                component: OpportunityListComponent,
                children: [
                    {
                        path: ':id',
                        component: OpportunityFormComponent,
                        resolve:{
                            selectedOpportunity: SelectedOpportunityResolver
                        },
                        canDeactivate: [OpportunityGuard]
                    
                    }
                    
                ]
            },
            {
                path: 'detail-view/:id',
                component: OpportunityDetailComponent,
                resolve:{
                    selectedOpportunity: SelectedOpportunityResolver,
                    tags: TagsResolver,
                    notes: NoteResolver,
                    tasks: TaskResolver,
                    email: EmailResolver,
                    call: CallResolver,
                    meeting: MeetingResolver
                },     
            }
        ]
    },
];