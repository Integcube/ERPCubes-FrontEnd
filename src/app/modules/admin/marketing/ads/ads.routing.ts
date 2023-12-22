import { Routes } from "@angular/router";
import { AdsDashboardComponent } from "./ads-dashboard/ads-dashboard.component";
import { AdsComponent } from "./ads.component";
import { ProductResolver } from "./ads.resolver";


export const adsRoute: Routes = [
    {
        path: '',
        component: AdsComponent,
        resolve: {
            product:ProductResolver
        },
        children: [
            {
                path: '',
                component: AdsDashboardComponent,
            },]
    },
];