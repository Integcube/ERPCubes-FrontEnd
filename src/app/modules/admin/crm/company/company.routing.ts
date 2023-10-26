import { Routes } from "@angular/router";
import { CompanyComponent } from "./company.component";
import { CompanyListComponent } from "./company-list/company-list.component";
import { CompanyFormComponent } from "./company-form/company-form.component";
import { CompaniesResolver, SelectedCompanyResolver } from "./company.resolvers";

export const companyRoutes: Routes = [
    {
        path: '',
        component: CompanyComponent,
        resolve: {
            companies: CompaniesResolver
        },
        children: [{
            path: '',
            component: CompanyListComponent,
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