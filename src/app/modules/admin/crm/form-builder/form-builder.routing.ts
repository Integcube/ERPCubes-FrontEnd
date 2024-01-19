import { Routes } from "@angular/router";
import { FormBuilderComponent } from "./form-builder.component";
import { FormBuilderListComponent } from "./form-builder-list/form-builder-list.component";
import { FormConfiguratorComponent } from "./form-configurator/form-configurator.component";
import { FieldSettingsComponent } from "./config/field-settings/field-settings.component";
import { 
    FieldTypesResolver, 
    FormFieldsResolver, 
    FormsResolver, 
    SelectedFieldResolver,
    SelectedFormResolver 
} from "./form-builder.resolver";


export const formBuilderRoutes: Routes = [
    {
      path: '',
      component: FormBuilderComponent,
      resolve: {
        forms: FormsResolver,
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
            fieldTypes: FieldTypesResolver,
            selectedForm: SelectedFormResolver,
            formFields: FormFieldsResolver,
          },
          children: [
            {
              path: 'field-settings',
              component: FieldSettingsComponent,
              resolve: {
                selectedField: SelectedFieldResolver,
              },
            },
          ],
        },
      ],
    },
  ];
  