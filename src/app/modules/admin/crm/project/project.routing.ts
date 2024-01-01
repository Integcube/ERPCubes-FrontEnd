import { Routes } from "@angular/router";
import { ProjectFormComponent } from "./project-form/project-form.component";
import { ProjectListComponent } from "./project-list/project-list.component";
import { ProjectComponent } from "./project.component";
import { CompanyResolver, ProjectResolver, SelectedProjectResolver } from "./project.resolver";



export const projectRoutes: Routes = [
    {
        path: '',
        component: ProjectComponent,
        resolve: {
            ProjectResolver,
            CompanyResolver,
        },
        children: [
            {
                path: '',
                component: ProjectListComponent,
                children: [
                    {
                        path: ':id',
                        component: ProjectFormComponent,
                        resolve: {
                            selectedProject: SelectedProjectResolver,
                        }
                    }
                ]
            }
        ]
    }
]