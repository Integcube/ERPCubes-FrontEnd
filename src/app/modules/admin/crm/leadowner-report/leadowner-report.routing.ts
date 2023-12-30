import { Routes } from "@angular/router";
import { LeadOwnerReportResolver, LeadSourceResolver, LeadStatusResolver, LeadUserListResolver, UserResolver } from "./leadowner-report.resolver";
import { LeadOwnerReportComponent } from "./leadowner-report.component";


export const leadOwnerReportRoutes: Routes = [
    {
        path: '',
        component:LeadOwnerReportComponent,
        resolve: {
            users: UserResolver,
            leadOwnerReport: LeadOwnerReportResolver,
            leadStatus: LeadStatusResolver,
            leadSource: LeadSourceResolver,
            leadUsersList: LeadUserListResolver
        }
    },
];