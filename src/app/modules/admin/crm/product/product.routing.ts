import { Routes } from "@angular/router";

import { ProductsResolver, SelectedProductResolver } from "./product.resolvers";
import { ProductComponent } from "./product.component";
import { ProductListComponent } from "./product-list/product-list.component";
import { ProductFormComponent } from "./product-form/product-form.component";

export const productRoutes: Routes = [
    {
        path: '',
        component: ProductComponent,
        resolve: {
            companies: ProductsResolver
        },
        children: [{
            path: '',
            component: ProductListComponent,
            children: [
                {
                    path: ':id',
                    component: ProductFormComponent,
                    resolve:{
                        selectedCompany:SelectedProductResolver
                    },
                }
                
            ]
        }]
    }

];