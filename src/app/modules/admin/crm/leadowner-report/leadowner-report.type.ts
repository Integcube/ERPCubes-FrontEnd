export class LeadOwnerReport {
    leadOwner: string;
    leadOwnerName:string  
    totalLeads?: number;
    totalRevenue?: number;
    averageDealSize?: number;
    winLeads?: number;
    winRate?: number;
    convertedLeads?: number;
    conversionRate?: number;
}
export interface LeadSource {
    sourceId: number;
    sourceTitle: string;
}
export interface LeadStatus {
    statusId: number;
    statusTitle: string;
    isDeletable: number;
    order: number;
}
