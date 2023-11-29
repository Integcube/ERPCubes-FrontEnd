import { Routes } from "@angular/router";
import { TeamComponent } from "./team.component";
import { TeamListComponent } from "./team-list/team-list.component";
import { TeamFormComponent } from "./team-form/team-form.component";
import { TeamsResolver, SelectedTeamResolver, UserResolver } from "./team.resolvers";

export const teamRoutes: Routes = [
    {
        path: '',
        component: TeamComponent,
        resolve: {
            teams: TeamsResolver
        },
        children: [{
            path: '',
            component: TeamListComponent,
            children: [
                {
                    path: ':id',
                    component: TeamFormComponent,
                    resolve:{
                        selectedTeam:SelectedTeamResolver,
                        user:UserResolver,
                    },
                
                }
                
            ]
        }]
    }

];