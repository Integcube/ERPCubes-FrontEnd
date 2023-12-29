import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignComponent } from './campaign.component';
import { CampaignListComponent } from './campaign-list/campaign-list.component';
import { CampaignFormComponent } from './campaign-form/campaign-form.component';
import { campaignRoutes } from './campaign.routing';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { SharedModule } from 'app/shared/shared.module';
import moment from 'moment';
@NgModule({
  declarations: [
    CampaignComponent,
    CampaignListComponent,
    CampaignFormComponent
  ],
  imports: [
    RouterModule.forChild(campaignRoutes),
    MatAutocompleteModule,
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
    MatSelectModule,
    MatSidenavModule,
    MatTableModule,
    MatTooltipModule,
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatIconModule,
    FuseFindByKeyPipeModule,
    SharedModule
  ],
  providers   : [
    {
        provide : MAT_DATE_FORMATS,
        useValue: {
            parse  : {
                dateInput: moment.ISO_8601
            },
            display: {
                dateInput         : 'LL',
                monthYearLabel    : 'MMM YYYY',
                dateA11yLabel     : 'LL',
                monthYearA11yLabel: 'MMMM YYYY'
            }
        }
    }
]
})
export class CampaignModule { }