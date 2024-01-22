import { Routes } from "@angular/router";
import { CustomFormComponent } from "./custom-form.component";

export const customFormRoutes: Routes = [
    {
      path: 'custom',
      component: CustomFormComponent,
      data: {
        queryParams: { param1: 'tenantId', param2: 'formId' }
      }
    }
]