
import { Routes } from "@angular/router";
export const crmRoutes: Routes = [{
    path: 'contacts', children: [
        { path: 'company', loadChildren: () => import('app/modules/admin/crm/company/company.module').then(m => m.CompanyModule) },
        { path: 'leads', loadChildren: () => import('app/modules/admin/crm/lead/lead.module').then(m => m.LeadModule) },
        { path: 'company', loadChildren: () => import('app/modules/admin/crm/company/company.module').then(m => m.CompanyModule) },
        { path: 'leads', loadChildren: () => import('app/modules/admin/crm/lead/lead.module').then(m => m.LeadModule) },
    ]
},

{
    path: 'configurations', children: [
        { path: 'users', loadChildren: () => import('app/modules/admin/crm/user/user.module').then(m => m.UserModule) },
    ]
},

{
    path: 'configurations', children:[
        { path: 'products',loadChildren:()=> import('app/modules/admin/crm/product/product.module').then(m=>m.ProductModule)},
    ]
}
]