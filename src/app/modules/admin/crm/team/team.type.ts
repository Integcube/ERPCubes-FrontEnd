export class TeamMembers{
  teamMemberId: number;
  userId: string = '';
  teamId: number;
}

export class Team{

    teamId: number;
    teamName: string = '';
    teamLeader: string = '';
    teamLeaderName: string = '';
    teamMembersId: string = '';
    teamMembersName: string = '';
    isHovered: boolean;
    deletedBy: string = '';
    deletedDate: Date;
    constructor(reg){
        this.teamId = reg.teamId? reg.teamId:-1;
    }
}