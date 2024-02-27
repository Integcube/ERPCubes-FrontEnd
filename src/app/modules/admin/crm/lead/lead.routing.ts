import { Routes } from "@angular/router";
import { LeadComponent } from "./lead.component";
import { LeadListComponent } from "./lead-list/lead-list.component";
import { LeadFormComponent } from "./lead-form/lead-form.component";
import { LeadDetailComponent } from "./lead-detail/lead-detail.component";
import { CallResolver, CustomListResolver,ScoreResolver ,EmailResolver,EventTypeResolver, IndustryResolver,CallReasonResolver, LeadSourceResolver, LeadStatusResolver, LeadsResolver, MeetingResolver, NoteResolver, ProductResolver, SelectedLeadResolver, TagsResolver, TaskResolver, UserResolver, CampaignsResolver } from "./lead.resolver";
import { LeadGuard } from "./lead.guard";

export const leadRoutes: Routes = [
    {
        path: '',
        component: LeadComponent,
        resolve: {
            leads: LeadsResolver,
            leadSource: LeadSourceResolver,
            leadStatus: LeadStatusResolver,
            industries: IndustryResolver,
            users: UserResolver,
            product: ProductResolver,
            campaigns: CampaignsResolver,
            customList: CustomListResolver,
            eventType:EventTypeResolver,                        
        },
        children: [
            {
                path: '',
                component: LeadListComponent,
                children: [
                    {
                        path: ':id',
                        component: LeadFormComponent,
                        resolve: {
                            selectedLead: SelectedLeadResolver
                        },
                        canDeactivate: [LeadGuard]
                    },

                ]
            },
            {
                path: 'detail-view/:id',
                component: LeadDetailComponent,
                resolve: {
                    selectedCompany: SelectedLeadResolver,
                    call: CallResolver,
                    callReason:CallReasonResolver,
                    email: EmailResolver,                    
                    meeting: MeetingResolver,                   
                    tasks: TaskResolver,
                    tags: TagsResolver,
                    notes: NoteResolver,                     
                    scoreResolver: ScoreResolver
                },
            }
        ]
    },
];