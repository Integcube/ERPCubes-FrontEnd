import { Routes } from "@angular/router";
import { LeadImportComponent } from "./lead-import.component";
import { LeadImportResolver, UserResolver } from "./lead-import.resolver";



export const leadImportRoutes: Routes = [
    {
        path: '',
        component:LeadImportComponent,
        resolve: {
            users: UserResolver,
            leadImport: LeadImportResolver
        }
    },
];