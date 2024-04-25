export interface LeadReport {
    status: number
    statusTitle:string  
    totalLeads: number
    totalLeadValue: number
    averageDealValue: number
    winLeads: number
    winRate: number
    convertedLeads: number
    conversionRate: number
    expectedRevenue: number
}
export class LeadPipelineFilter {
    sourceId: number;
    productId: number;
    status: number;
    startDate: Date;
    endDate: Date;
    tenantId: number;
    constructor(reg) {
        this.sourceId = reg.sourceId?reg.sourceId:-1; 
        this.productId = reg.productId?reg.productId:-1;
        this.status =  reg.status?reg.status:-1;

        const currentDate = new Date();
        

        

        if (reg.startDate === null || reg.startDate === undefined) {
            const currentDate = new Date();
            this.startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 2);

        } else {
            this.startDate = reg.startDate;
        }
        this.endDate = reg.endDate?reg.endDate: this.endDate = new Date(currentDate.getFullYear(),currentDate.getMonth()+1,1);
       
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

