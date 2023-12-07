
import { Routes } from "@angular/router";
export const crmRoutes: Routes = [{
    path: 'contacts', children: [
        { path: 'company', loadChildren: () => import('app/modules/admin/crm/company/company.module').then(m => m.CompanyModule) },
        { path: 'leads', loadChildren: () => import('app/modules/admin/crm/lead/lead.module').then(m => m.LeadModule) },
        { path: 'company', loadChildren: () => import('app/modules/admin/crm/company/company.module').then(m => m.CompanyModule) },
    ]
},
{
    path: 'report', children: [
        { path: 'lead-report', loadChildren: () => import('app/modules/admin/crm/lead-report/lead-report.module').then(m => m.LeadReportModule) },
    ]
},
{
    path: 'configurations', children: [
        { path: 'users', loadChildren: () => import('app/modules/admin/crm/user/user.module').then(m => m.UserModule) },
        { path: 'teams', loadChildren: () => import('app/modules/admin/crm/team/team.module').then(m => m.TeamModule) },
        { path: 'products',loadChildren:()=> import('app/modules/admin/crm/product/product.module').then(m=>m.ProductModule)},
    ]
},
]