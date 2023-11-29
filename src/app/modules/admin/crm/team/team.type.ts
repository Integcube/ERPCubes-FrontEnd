export class TeamMembers{
  teamMemberId: number;
  userId: string = '';
  teamId: number;
}

export class Team{

    teamId: number;
    teamName: string = '';
    teamLeaderId: string = '';
    teamLeaderName: string = '';
    teamMembersId: string = '';
    teamMembersName: string = '';
    isHovered: boolean;
    constructor(reg){
        this.teamId = reg.teamId? reg.teamId:-1;
    }
}