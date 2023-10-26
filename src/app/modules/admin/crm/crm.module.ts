import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { crmRoutes } from './crm.routing';
import { SharedModule } from 'app/shared/shared.module';



@NgModule({
  declarations: [
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(crmRoutes),
  ]
})
export class CrmModule { }
