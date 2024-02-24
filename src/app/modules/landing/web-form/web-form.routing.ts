import { Routes } from "@angular/router";
import { WebFormComponent } from "./web-form.component";

export const webFormRoutes: Routes = [
    {
      path: 'web',
      component: WebFormComponent,
      data: {
        queryParams: { param1: 'key', param2: 'formkey' }
      }
    }
]