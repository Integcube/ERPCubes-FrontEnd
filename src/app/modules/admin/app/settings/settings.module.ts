import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { SettingsComponent } from 'app/modules/admin/app/settings/settings.component';
import { SettingsAccountComponent } from 'app/modules/admin/app/settings/account/account.component';
import { SettingsSecurityComponent } from 'app/modules/admin/app/settings/security/security.component';
import { SettingsPlanBillingComponent } from 'app/modules/admin/app/settings/plan-billing/plan-billing.component';
import { SettingsNotificationsComponent } from 'app/modules/admin/app/settings/notifications/notifications.component';
import { SettingsTeamComponent } from 'app/modules/admin/app/settings/team/team.component';
import { settingsRoutes } from 'app/modules/admin/app/settings/settings.routing';
import { SettingsChannelComponent } from './channel/channel.component';
import { FuseCardModule } from '@fuse/components/card';
import { ViewComponent } from './view/view.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChatbotViewComponent } from './chatbot-view/chatbot-view.component.component';

@NgModule({
    declarations: [
        SettingsComponent,
        SettingsAccountComponent,
        SettingsSecurityComponent,
        SettingsPlanBillingComponent,
        SettingsNotificationsComponent,
        SettingsTeamComponent,
        SettingsChannelComponent,
        ViewComponent,
        ChatbotViewComponent
    ],
    imports     : [
        RouterModule.forChild(settingsRoutes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        MatSidenavModule,
        MatSlideToggleModule,
        FuseAlertModule,
        SharedModule,
        FuseCardModule,
        MatTooltipModule
    ]
})
export class SettingsModule
{
}
