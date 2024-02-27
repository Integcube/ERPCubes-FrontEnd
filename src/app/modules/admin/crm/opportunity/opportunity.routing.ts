import { Routes } from "@angular/router";
import { OpportunityComponent } from "./opportunity.component";
import { CallReasonResolver, CallResolver, CustomListResolver, EmailResolver, EventTypeResolver, IndustryResolver, MeetingResolver, NoteResolver, OpportunityResolver, OpportunitySourceResolver, OpportunityStatusResolver, ProductResolver, SelectedOpportunityResolver, TagsResolver, TaskResolver, UserResolver } from "./opportunity.resolver";
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
            opportunitySource: OpportunitySourceResolver,
            opportunityStatus: OpportunityStatusResolver,
            industries: IndustryResolver,
            users: UserResolver,
            product: ProductResolver,
            customList: CustomListResolver,
            eventType:EventTypeResolver,
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
                    call: CallResolver,
                    callReason: CallReasonResolver,
                    email: EmailResolver,
                    meeting: MeetingResolver,
                    tasks: TaskResolver,
                    tags: TagsResolver,
                    notes: NoteResolver,
                },     
            }
        ]
    },
];