import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { checklistRoutes } from './checklist.routing';




@NgModule({
  declarations: [
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(checklistRoutes),
  ]
})
export class CheckListModule { }
