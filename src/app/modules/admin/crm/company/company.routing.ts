import { Routes } from "@angular/router";
import { CompanyComponent } from "./company.component";
import { CompanyListComponent } from "./company-list/company-list.component";
import { CompanyFormComponent } from "./company-form/company-form.component";
import { CompaniesResolver, IndustryResolver, SelectedCompanyResolver } from "./company.resolvers";

export const companyRoutes: Routes = [
    {
        path: '',
        component: CompanyComponent,
        resolve: {
            industries: IndustryResolver
        },
        children: [{
            path: '',
            component: CompanyListComponent,
            resolve: {
                companies: CompaniesResolver
            },
            children: [
                {
                    path: ':id',
                    component: CompanyFormComponent,
                    resolve:{
                        selectedCompany:SelectedCompanyResolver
                    },
                }
                
            ]
        }]
    }
];