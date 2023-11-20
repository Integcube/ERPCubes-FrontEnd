export class Company{
    companyId: number;
    name: string;
    website: string;
    companyOwner: string;
    mobile?: string;
    work?: string;
    billingAddress?: string;
    billingStreet?: string;
    billingCity?: string;
    billingZip?: string;
    billingState?: string;
    billingCountry?: string;
    deliveryAddress?: string;
    deliveryStreet?: string;
    deliveryCity?: string;
    deliveryZip?: string;
    deliveryState?: string;
    deliveryCountry?: string;
    industryId: number;
    industryTitle: string;
    createdDate: Date;
    isHovered:boolean;
    avatar:string;
    constructor(reg){
        this.companyId = reg.companyId?reg.companyId:-1;
    }
}
export interface Industry{
    industryId:number,
    industryTitle:string
}