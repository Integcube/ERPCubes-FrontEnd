import { Routes } from "@angular/router";
import { AssignChecklistComponent } from "./assign-checklist.component";
import { AssignCheckListResolver, AssignFormResolver, CheckListResolver, UserResolver } from "./assign-checklist.resolvers";
import { AssignChecklistFormComponent } from "./assign-checklist-form/assign-checklist-form.component";


export const AssignChecklistRouting: Routes = [
    {
        path: '',
        component: AssignChecklistComponent,
        resolve: {
            CheckList:CheckListResolver,
            AssignCheckList: AssignCheckListResolver,
            User:UserResolver
        },
    },
    {
        path: ':id',
        component: AssignChecklistFormComponent,
        resolve: {
            CheckList:CheckListResolver,
            AssignCheckList: AssignCheckListResolver,
            User:UserResolver,
            Assign:AssignFormResolver
        },
    },
];