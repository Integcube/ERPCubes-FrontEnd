export interface LeadReport {
    campaignId: number
    campaignTitle:string  
    source:string  
    totalLeads: number
    winLeads: number
    winRate: number
    convertedLeads: number
    conversionRate: number
    totalCost: number
    costperLead: number
    revenueGenerated: number
    returnonInvestment: number
}
export class LeadPipelineFilter {
    sourceId: number;
    productId: number;
    campaign: number;
    startDate: Date;
    endDate: Date;
    tenantId: number;
    constructor(reg) {
        this.sourceId = reg.sourceId?reg.sourceId:-1; 
        this.productId = reg.productId?reg.productId:-1;
        this.campaign =  reg.Campaign?reg.Campaign:'-1';
        if (reg.startDate === null || reg.startDate === undefined) {
            const currentDate = new Date();
            this.startDate = new Date(currentDate.setDate(currentDate.getDate() - 30));
        } else {
            this.startDate = reg.startDate;
        }
        this.endDate = reg.endDate?reg.endDate:new Date(); 
        // this.startDate.setDate(this.startDate.getDate() - 30);
    }
}

export interface LeadStatus {
    statusId: number;
    statusTitle: string;
    isDeletable: number;
    order: number;
}
export interface Product {
    productId: number;
    productName: string;
    description: string;
    price: number;
}

export interface LeadSource {
    sourceId: number;
    sourceTitle: string;
}

