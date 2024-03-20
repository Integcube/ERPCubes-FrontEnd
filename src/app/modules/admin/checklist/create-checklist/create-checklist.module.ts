import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreateChecklistRouting } from './create-checklist.routing';



@NgModule({
  declarations: [

  ],
  imports: [
    RouterModule.forChild(CreateChecklistRouting),
 
  ]
})
export class CreateChecklistModule { }
