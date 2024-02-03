export class ActivityReport {
    leadOwner: string = '';
    leadOwnerName: string = '';
    lead?: number;
    note?: number;
    call?: number;
    email?: number;
    task?: number;
    meeting?: number;
    total?: number;
}

export class Filter {
    id:string
    projectId: number;
    productId: number;
    status: number;
    startDate: Date;
    endDate: Date;
    tenantId: number;
    constructor(reg) {
        this.projectId = reg.projectId?reg.projectId:-1; 
        this.productId = reg.productId?reg.productId:-1;
        this.status =  reg.status?reg.status:-1;

        const currentDate = new Date();
        if (reg.startDate === null || reg.startDate === undefined) {
            const currentDate = new Date();
            this.startDate = new Date(currentDate.getFullYear(),currentDate.getMonth(),1);
        } else {
            this.startDate = reg.startDate;
        }
        this.endDate = reg.endDate?reg.endDate: this.endDate = new Date(currentDate.getFullYear(),currentDate.getMonth()+1,0);
       
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

export class Project {
    projectId: number
    title: string
    companyId: number
    code: string
    budget: number
    description: string
    constructor(reg){
        this.projectId = reg.projectId? reg.projectId: -1;
    }
}
