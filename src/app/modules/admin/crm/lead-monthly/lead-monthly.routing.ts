import { Routes } from "@angular/router";
import { LeadMonthlyResolver, LeadSourceResolver, ProductResolver, UserResolver } from "./lead-monthly.resolver";
import { LeadMonthlyComponent } from "./lead-monthly.component";


export const leadMonthlyRoutes: Routes = [
    {
        path: '',
        component:LeadMonthlyComponent,
        resolve: {
            users: UserResolver,
            leadMonthly: LeadMonthlyResolver,
            products: ProductResolver,
            leadSource: LeadSourceResolver,
        }
    },
];