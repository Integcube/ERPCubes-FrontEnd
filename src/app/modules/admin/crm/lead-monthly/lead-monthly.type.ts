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

export class LeadMonthlyFilter {
    sourceId: number;
    productId: number;
    userId: string;
    year: Date;
    tenantId: number;
    constructor(reg) {
        this.sourceId = reg.sourceId ? reg.sourceId : -1; 
        this.productId = reg.productId ? reg.productId : -1;
        this.userId =  reg.userId ? reg.userId : "-1";
        if (reg.year === null || reg.year === undefined) {;
            this.year = new Date();
        } else {
            this.year = reg.year;
        }
    }
}

export class LeadStatus {
    statusId: number;
    statusTitle: string;
    isDeletable: number;
    order: number;
    count: number;
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

export interface User {
    id: string;
    name: string;
}