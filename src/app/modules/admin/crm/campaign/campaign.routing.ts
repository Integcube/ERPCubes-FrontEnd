import { Routes } from "@angular/router";
import { UserResolver } from "../company/company.resolvers";
import { CampaignFormComponent } from "./campaign-form/campaign-form.component";
import { CampaignListComponent } from "./campaign-list/campaign-list.component";
import { CampaignComponent } from "./campaign.component";
import { CampaignResolver, ProductResolver, SelectedCampaignResolver, SourceResolver } from "./campaign.resolver";

export const campaignRoutes: Routes = [
    {
        path: '',
        component: CampaignComponent,
        resolve: {
            CampaignResolver,
            ProductResolver,
            SourceResolver
        },
        children: [
            {
                path: '',
                component: CampaignListComponent,
                children: [
                    {
                        path: ':id',
                        component: CampaignFormComponent,
                        resolve: {
                            selectedCampaign: SelectedCampaignResolver,
                            user: UserResolver
                        }
                    }
                ]
            }
        ]
    }
]