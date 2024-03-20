import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExecuteChecklistRouting } from './execute-checklist.routing';



@NgModule({
  declarations: [

  ],
  imports: [
    RouterModule.forChild(ExecuteChecklistRouting),
  ]
})
export class ExecuteChecklistModule { }
