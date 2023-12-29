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
        this.startDate =reg.startDate?reg.startDate:new Date(); 
        this.endDate = reg.endDate?reg.endDate:new Date(); 
        this.startDate.setDate(this.startDate.getDate() - 30);
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

export const MY_DATE_FORMATS = {
    parse: {
      dateInput: 'DD-MM-YYYY',
    },
    display: {
      dateInput: 'MMM DD, YYYY',
      monthYearLabel: 'MMMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY'
    },
};