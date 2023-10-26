import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamFormComponent } from './team-form/team-form.component';
import { TeamListComponent } from './team-list/team-list.component';
import { TeamComponent } from './team.component';



@NgModule({
  declarations: [
    TeamFormComponent,
    TeamListComponent,
    TeamComponent
  ],
  imports: [
    CommonModule
  ]
})
export class TeamModule { }
