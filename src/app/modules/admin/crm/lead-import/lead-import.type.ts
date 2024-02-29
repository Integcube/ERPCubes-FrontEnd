export class LeadImportList {
    leadId: number;
    firstName: string = "";
    lastName: string = "";
    email: string = "";
    status: number;
    statusTitle: string = "";
    leadOwner: string = "";
    mobile: string = "";
    work: string = "";
    address: string = "";
    street: string = "";
    city: string = "";
    zip: string = "";
    state: string = "";
    country: string = "";
    companyTitle:string="";
    sourceTitle: string = "";
    industryTitle: string = "";
    productTitle: string = "";
    createdDate: Date;
    modifiedDate: Date;
    isHovered: boolean;
    product: Product;
    industry: Industry;
    avatar: any;
    constructor(reg) {
        this.leadId = reg.leadId ? reg.leadId : -1;
        this.status = reg.status ? reg.status : 0;
        this.createdDate = reg.createdDate ? reg.createdDate : Date.now;
    }
}

export interface Product {
    productId: number;
    productName: string;
    description: string;
    price: number;
}
export interface Industry {
    industryId: number,
    industryTitle: string
}
export class Lead {
    leadId: number;
    firstName: string = "";
    lastName: string = "";
    email: string = "";
    status: number;
    statusTitle: string = "";
    leadOwner: string = "";
    mobile: string = "";
    work: string = "";
    address: string = "";
    street: string = "";
    city: string = "";
    zip: string = "";
    state: string = "";
    country: string = "";
    sourceId: number;
    companyId:number;
    companyTitle:string="";
    sourceTitle: string = "";
    industryId: number;
    industryTitle: string = "";
    productId: number;
    productTitle: string = "";
    campaignId: string = "";
    campaignTitle: string = "";
    createdDate: Date;
    modifiedDate: Date;
    isHovered: boolean;
    avatar: any;
    constructor(reg) {
        this.leadId = reg.leadId ? reg.leadId : -1;
        this.status = reg.status ? reg.status : 1;
        this.leadOwner = reg.leadOwner ? reg.leadOwner : -1;
        this.sourceId = reg.sourceId ? reg.sourceId : -1;
        this.industryId = reg.industryId ? reg.industryId : -1;
        this.productId = reg.productId ? reg.productId : -1;
        this.createdDate = reg.createdDate ? reg.createdDate : Date.now;
        this.campaignId=reg.campaignId ? reg.campaignId : "-1";
    }
}
// export interface Product {
//     productId: number;
//     productName: string;
//     description: string;
//     price: number;
// }
// export interface Industry {
//     industryId: number,
//     industryTitle: string
// }