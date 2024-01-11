import { Routes } from "@angular/router";
import { FormBuilderComponent } from "./form-builder.component";
import { FormBuilderListComponent } from "./form-builder-list/form-builder-list.component";
import { FormConfiguratorComponent } from "./form-configurator/form-configurator.component";
import { FieldSettingsComponent } from "./config/field-settings/field-settings.component";


export const formBuilderRoutes: Routes = [
    {
        path: '',
        component: FormBuilderComponent,
        resolve: {
            
        },
        children: [
            {
                path: '',
                component: FormBuilderListComponent,
            },
            {
                path: ':id',
                component: FormConfiguratorComponent,
                resolve: {
                },
                children: [
                    {
                        path: ':id',
                        component: FieldSettingsComponent,
                    }
                ]
            }]
    },
];