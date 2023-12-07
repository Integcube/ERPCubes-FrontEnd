import { Routes } from "@angular/router";
import { LeadReportComponent } from "./lead-report.component";
import { UserResolver, LeadReportResolver, LeadStatusResolver } from "./lead-report.resolver";


export const leadReportRoutes: Routes = [
    {
        path: '',
        component: LeadReportComponent,
        resolve: {
            users: UserResolver,
            leadReport: LeadReportResolver,
            leadStatus: LeadStatusResolver,
        }

    },
];