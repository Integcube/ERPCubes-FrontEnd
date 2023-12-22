import { NgModule } from '@angular/core';
import { AdsComponent } from './ads.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { AdsDashboardComponent } from './ads-dashboard/ads-dashboard.component';
import { CreateAdAccountComponent } from './create-ad-account/create-ad-account.component';
import { ConnectAdAccountComponent } from './connect-ad-account/connect-ad-account.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseCardModule } from '@fuse/components/card';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { QuillModule } from 'ngx-quill';
import { adsRoute } from './ads.routing';
import { MatStepperModule } from '@angular/material/stepper';
import { SocialLoginModule, GoogleLoginProvider, FacebookLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { SelectAdAccountComponent } from './select-ad-account/select-ad-account.component';
import { CustomFacebookLoginProvider } from './customFacebookLoginProvider';


@NgModule({
  declarations: [
    AdsComponent,
    AdsDashboardComponent,
    CreateAdAccountComponent,
    ConnectAdAccountComponent,
    SelectAdAccountComponent
  ],
  imports: [
    RouterModule.forChild(adsRoute),
    MatButtonModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatMomentDateModule,
    MatProgressBarModule,
    MatRadioModule,
    MatRippleModule,
    QuillModule,
    MatSelectModule,
    MatSidenavModule,
    MatTableModule,
    MatTooltipModule,
    FuseFindByKeyPipeModule,
    SharedModule,
    MatExpansionModule,
    MatTabsModule,
    SocialLoginModule,
    FuseCardModule,
    DragDropModule,
    MatDialogModule,
    MatStepperModule,

  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          // {
          //   id: GoogleLoginProvider.PROVIDER_ID,
          //   provider: new GoogleLoginProvider(
          //     'clientId'
          //   )
          // },
          {
            id: CustomFacebookLoginProvider.PROVIDER_ID,
            provider: new CustomFacebookLoginProvider('1043379676992727')
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
})
export class AdsModule { }
