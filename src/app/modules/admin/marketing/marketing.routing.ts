
import { Routes } from "@angular/router";
export const marketingRoutes: Routes = [
    { path: 'onboarding', loadChildren: () => import('app/modules/admin/marketing/ads/ads.module').then(m => m.AdsModule) },
]