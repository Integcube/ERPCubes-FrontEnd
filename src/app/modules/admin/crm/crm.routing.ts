
import { Routes } from "@angular/router";
export const crmRoutes: Routes = [
{
    path: 'contacts', children: [
        { path: 'company', loadChildren: () => import('app/modules/admin/crm/company/company.module').then(m => m.CompanyModule) },
        { path: 'leads', loadChildren: () => import('app/modules/admin/crm/lead/lead.module').then(m => m.LeadModule) },
        { path: 'opportunity',loadChildren:()=> import('app/modules/admin/crm/opportunity/opportunity.module').then(m=>m.OpportunityModule)},
        { path: 'lead-import',loadChildren:()=> import('app/modules/admin/crm/lead-import/lead-import.module').then(m=>m.LeadImportModule)},

    ]
},
{
    path: 'reports', children: [
        { path: 'lead-report', loadChildren: () => import('app/modules/admin/crm/lead-report/lead-report.module').then(m => m.LeadReportModule) },
        { path: 'activity-report', loadChildren: () => import('app/modules/admin/crm/activity-report/activity-report.module').then(m => m.ActivityReportModule) },
        { path: 'lead-monthly', loadChildren: () => import('app/modules/admin/crm/lead-monthly/lead-monthly.module').then(m => m.LeadMonthlyModule) },
        { path: 'lead-Pipeline-Report', loadChildren: () => import('app/modules/admin/crm/lead-pipeline-report/lead-pipeline.module').then(m => m.leadPipelineModule) },
        { path: 'campaig-effectiveness-reports', loadChildren: () => import('app/modules/admin/crm/campaig-effectiveness-reports/campaig-effectiveness.module').then(m => m.CampaigEffectivenessModule) },
       
        { path: 'leadsource-report', loadChildren: () => import('app/modules/admin/crm/leadsource-report/leadsource-report.module').then(m => m.LeadSourceReportModule) },
        { path: 'leadowner-report', loadChildren: () => import('app/modules/admin/crm/leadowner-report/leadowner-report.module').then(m => m.LeadOwnerReportModule) },


    ]
},
{
    path: 'configurations', children: [
        { path: 'users', loadChildren: () => import('app/modules/admin/crm/user/user.module').then(m => m.UserModule) },
        { path: 'teams', loadChildren: () => import('app/modules/admin/crm/team/team.module').then(m => m.TeamModule) },
        { path: 'products',loadChildren:()=> import('app/modules/admin/crm/product/product.module').then(m=>m.ProductModule)},
        { path: 'campaign',loadChildren:()=> import('app/modules/admin/crm/campaign/campaign.module').then(m=>m.CampaignModule)},
        { path: 'project',loadChildren:()=> import('app/modules/admin/crm/project/project.module').then(m=>m.ProjectModule)},
        { path: 'forms',loadChildren:()=> import('app/modules/admin/crm/form-builder/form-builder.module').then(m=>m.FormBuilderModule)},
        { path: 'lead-questionaire', loadChildren:() => import('app/modules/admin/crm/lead-questionaire/lead-questionaire.module').then(m => m.LeadQuestionaireModule)}
    ]
},
]