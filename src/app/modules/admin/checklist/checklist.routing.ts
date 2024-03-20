import { Routes } from "@angular/router";


export const checklistRoutes: Routes = [
    {
        path: '',
        children: [
            { path: 'create', loadChildren: () => import('app/modules/admin/checklist/create-checklist/create-checklist.module').then(m => m.CreateChecklistModule) },
            { path: 'assign', loadChildren: () => import('app/modules/admin/checklist/assign-checklist/assign-checklist.module').then(m => m.AssignChecklistModule) },
            { path: 'execute', loadChildren: () => import('app/modules/admin/checklist/execute-checklist/execute-checklist.module').then(m => m.ExecuteChecklistModule) },
        ]
    }
];