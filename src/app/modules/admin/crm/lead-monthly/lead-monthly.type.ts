export class LeadMonthly {
    year: number;
    month: number;
    totalLeads: number;
    leadStatusList: LeadStatus[]; 
    newLead: number;
    contactedLead: number;
    interestedLead: number;
    qualifiedLead: number;
    lostLead: number;
    wonLead : number;
}

export class LeadStatus {
    statusId: number;
    statusTitle: string;
    isDeletable: number;
    order: number;
    count: number;
}