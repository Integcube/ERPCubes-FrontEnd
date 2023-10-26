
import { Routes } from "@angular/router";
export const crmRoutes: Routes = [{
    path: 'contacts', children: [
        { path: 'company', loadChildren: () => import('app/modules/admin/crm/company/company.module').then(m => m.CompanyModule) },
    ]
}]