export class LeadSourceReport {
    sourceId: number;
    source: string = '';
    sourceName: string = '';
    totalLeads?: number;
    convertedLeads?: number;
    conversionRate?: number;
    averageDealSize?: number;
    totalRevenue?: number;
}
export interface LeadSource {
    sourceId: number;
    sourceTitle: string;
}