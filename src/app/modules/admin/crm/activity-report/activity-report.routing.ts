import { Routes } from "@angular/router";
import { UserResolver, ActivityReportResolver ,ProductResolver,ProjectResolver,LeadStatusResolver} from "./activity-report.resolver";
import { ActivityReportComponent } from "./activity-report.component";


export const activityReportRoutes: Routes = [
    {
        path: '',
        component: ActivityReportComponent,
        resolve: {
            users: UserResolver,
            activityReport: ActivityReportResolver,
            products: ProductResolver,
            Project: ProjectResolver,
            LeadStatus:LeadStatusResolver
        }
    },
];