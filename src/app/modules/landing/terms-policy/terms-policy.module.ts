import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { RouterModule } from '@angular/router';
import { termsPolicyRoutes } from './terms-policy.routing';
import { SharedModule } from 'app/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    TermsAndConditionsComponent,
    PrivacyPolicyComponent
  ],
  imports: [
    RouterModule.forChild(termsPolicyRoutes),
    MatIconModule,
    CommonModule,
    SharedModule
  ]
})
export class TermsPolicyModule { }
