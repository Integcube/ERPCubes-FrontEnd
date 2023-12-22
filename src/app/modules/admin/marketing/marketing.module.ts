import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { marketingRoutes } from './marketing.routing';



@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(marketingRoutes)
  ]
})
export class MarketingModule { }
