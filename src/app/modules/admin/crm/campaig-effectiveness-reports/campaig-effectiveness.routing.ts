import { Routes } from "@angular/router";
import { CampaigEffectivenessComponent } from "./campaig-effectiveness.component";
import { UserResolver,LeadReportResolver, LeadStatusResolver, ProductResolver,LeadSourceResolver } from "./campaig-effectiveness.resolver";


export const leadPipelineRoutes: Routes = [
    {
        path: '',
        component: CampaigEffectivenessComponent,
        resolve: {
            users: UserResolver,
            leadStatus: LeadStatusResolver,
            products: ProductResolver,
            leadSource: LeadSourceResolver,
            LeadReport:LeadReportResolver
        }
    },
];