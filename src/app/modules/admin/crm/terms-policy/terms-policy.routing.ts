import { Routes } from "@angular/router";
import { PrivacyPolicyComponent } from "./privacy-policy/privacy-policy.component";
import { TermsAndConditionsComponent } from "./terms-and-conditions/terms-and-conditions.component";

export const termsPolicyRoutes: Routes = [
    {
        path:'terms',
        component: TermsAndConditionsComponent,
        
    },
    {
        path:'policy',
        component: PrivacyPolicyComponent,
    }
]