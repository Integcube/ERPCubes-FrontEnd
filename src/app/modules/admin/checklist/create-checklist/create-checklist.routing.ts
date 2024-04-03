import { Routes } from "@angular/router";
import { CreateChecklistComponent } from "./create-checklist.component";
import { CreateChecklistformComponent } from "./create-checklistform/create-checklistform.component";
import { CreateFormResolver } from "./create-checklist.resolvers";


export const CreateChecklistRouting: Routes = [
    {
        path: '',
        component: CreateChecklistComponent,

    },

    {
        path: ':id',
        component: CreateChecklistformComponent,
        resolve: {
         CheckList:CreateFormResolver,
        
        },
    },

];