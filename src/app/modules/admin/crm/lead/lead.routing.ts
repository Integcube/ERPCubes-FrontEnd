import { Routes } from "@angular/router";
import { LeadComponent } from "./lead.component";
import { LeadListComponent } from "./lead-list/lead-list.component";
import { LeadFormComponent } from "./lead-form/lead-form.component";
import { LeadDetailComponent } from "./lead-detail/lead-detail.component";
import { CallResolver, CustomListResolver, EmailResolver, IndustryResolver,CallReasonCResolver, LeadSourceResolver, LeadStatusResolver, LeadsResolver, MeetingResolver, NoteResolver, ProductResolver, SelectedLeadResolver, TagsResolver, TaskResolver, UserResolver } from "./lead.resolver";
import { LeadGuard } from "./lead.guard";

export const leadRoutes: Routes = [
    {
        path: '',
        component: LeadComponent,
        resolve: {
            industries: IndustryResolver,
            users: UserResolver,
            leads: LeadsResolver,
            leadSource: LeadSourceResolver,
            leadStatus: LeadStatusResolver,
            product: ProductResolver,
            customList: CustomListResolver
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
                    tags: TagsResolver,
                    notes: NoteResolver,
                    tasks: TaskResolver,
                    email: EmailResolver,
                    call: CallResolver,
                    meeting: MeetingResolver,
                    CallReason:CallReasonCResolver
                },
            }]
    },
];