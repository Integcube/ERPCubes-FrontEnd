export class Opportunity {
    opportunityId: number
    opportunityTitle: string
    opportunitySource: number
    opportunityDetail: string
    isHovered: boolean;
    constructor(reg){
        this.opportunityId = reg.opportunityId? reg.opportunityId:-1;
    }
}

export class OpportunitySource {
    sourceId: number
    sourceTitle: string
}