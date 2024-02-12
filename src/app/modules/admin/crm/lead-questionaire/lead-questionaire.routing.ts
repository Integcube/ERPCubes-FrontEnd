import { Route } from "@angular/router";
import { LeadQuestionaireComponent } from "./lead-questionaire.component";
import { ProductsResolver } from "./lead-questionaire.resolver";
import { LeadQuestionaireListComponent } from "./lead-questionaire-list/lead-questionaire-list.component";
import { LeadQuestionaireFormComponent } from "./lead-questionaire-form/lead-questionaire-form.component";

export const questionaireRoutes: Route[] = [
    {
        path: '',
        component: LeadQuestionaireComponent,
        resolve: {
            products: ProductsResolver,
        },
        children: [
            {
                path: '',
                component: LeadQuestionaireListComponent,
            }
        ]
    }
]