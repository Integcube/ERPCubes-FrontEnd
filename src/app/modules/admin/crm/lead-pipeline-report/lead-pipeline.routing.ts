import { Routes } from "@angular/router";
import { LeadPipelineComponent } from "./lead-pipeline.component";
import { UserResolver,LeadReportResolver, LeadStatusResolver, ProductResolver,LeadSourceResolver } from "./lead-Pipeline.resolver";


export const leadPipelineRoutes: Routes = [
    {
        path: '',
        component: LeadPipelineComponent,
        resolve: {
            users: UserResolver,
            leadStatus: LeadStatusResolver,
            products: ProductResolver,
            leadSource: LeadSourceResolver,
            LeadReport:LeadReportResolver
        }
    },
];