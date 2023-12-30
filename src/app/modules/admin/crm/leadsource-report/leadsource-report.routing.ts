import { Routes } from "@angular/router";
import { LeadSourceReportResolver, LeadStatusResolver, UserResolver } from "./leadsource-report.resolver";
import { LeadSourceReportComponent } from "./leadsource-report.component";


export const leadSourceReportRoutes: Routes = [
    {
        path: '',
        component:LeadSourceReportComponent,
        resolve: {
            users: UserResolver,
            leadSourceReport: LeadSourceReportResolver,
            leadStatus: LeadStatusResolver,
        }
    },
];