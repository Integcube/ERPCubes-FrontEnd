import { Routes } from "@angular/router";
import { AssignChecklistComponent } from "./assign-checklist.component";
import { AssignCheckListResolver, CheckListResolver } from "./assign-checklist.resolvers";


export const AssignChecklistRouting: Routes = [
    {
        path: '',
        component: AssignChecklistComponent,
        resolve: {
            CheckList:CheckListResolver,
            AssignCheckList: AssignCheckListResolver
        },
    },
];