import { Routes } from "@angular/router";


export const checklistRoutes: Routes = [
    {
        path: '',
        children: [
            { path: 'create', loadChildren: () => import('app/modules/admin/checklist/create-checklist/create-checklist.module').then(m => m.CreateChecklistModule) },
            { path: 'assign', loadChildren: () => import('app/modules/admin/checklist/assign-checklist/assign-checklist.module').then(m => m.AssignChecklistModule) },
            { path: 'execute', loadChildren: () => import('app/modules/admin/checklist/execute-checklist/execute-checklist.module').then(m => m.ExecuteChecklistModule) },
            { path: 'assigntolead', loadChildren: () => import('app/modules/admin/checklist/assign-to-lead/assign-to-lead.module').then(m => m.AssignToLeadModule) },
            { path: 'report', loadChildren: () => import('app/modules/admin/checklist/checklist-report/checklist-report.module').then(m => m.ChecklistReportModule) },
            { path: 'executedchecklist-report', loadChildren: () => import('app/modules/admin/checklist/executedchecklist-report/executedchecklist-report.module').then(m => m.ExecutedChecklistReportModule) },

            
        ]
    }
];