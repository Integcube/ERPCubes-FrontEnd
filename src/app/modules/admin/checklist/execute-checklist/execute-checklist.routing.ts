import { Routes } from "@angular/router";
import { ExecuteChecklistComponent } from "./execute-checklist.component";
import { ExecuteFormComponent } from "./execute-form/execute-form.component";
import { ExcuteFormResolver } from "./execute-checklist.resolvers";


export const ExecuteChecklistRouting: Routes = [
    {
        path: '',
        component: ExecuteChecklistComponent,

    },

    {
        path: ':id',
        component: ExecuteFormComponent,
        resolve: {
            Assign:ExcuteFormResolver
        },
    },
];