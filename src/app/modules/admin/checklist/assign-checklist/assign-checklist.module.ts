import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AssignChecklistRouting } from './assign-checklist.routing';



@NgModule({
  declarations: [

  ],
  imports: [
    RouterModule.forChild(AssignChecklistRouting),
  ]
})
export class AssignChecklistModule { }
