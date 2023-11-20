import { Routes } from "@angular/router";
import { CompanyComponent } from "./company.component";
import { CompanyListComponent } from "./company-list/company-list.component";
import { CompanyFormComponent } from "./company-form/company-form.component";
import { CompaniesResolver, IndustryResolver, SelectedCompanyResolver, UserResolver } from "./company.resolvers";
import { CompanyGuard } from "./company.guards";
import { CompanyDetailComponent } from "./company-detail/company-detail.component";

export const companyRoutes: Routes = [
    {
        path: '',
        component: CompanyComponent,
        resolve: {
            industries: IndustryResolver,
            users: UserResolver,
            companies: CompaniesResolver
        },
        children: [
            {
                path: '',
                component: CompanyListComponent,
                children: [
                    {
                        path: ':id',
                        component: CompanyFormComponent,
                        resolve: {
                            selectedCompany: SelectedCompanyResolver
                        },
                        canDeactivate: [CompanyGuard]

                    },

                ]
            },
            {
                path: 'detail-view/:id',
                component: CompanyDetailComponent,
                resolve: {
                    selectedCompany: SelectedCompanyResolver
                },
            }]
    },
];