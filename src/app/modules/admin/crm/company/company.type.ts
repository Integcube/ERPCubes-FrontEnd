export class CompanyFilter{
    companyOwner: string[] = [];
    createdDate: Date = null;
    modifiedDate: Date = null;
    industryId: number[] = []
}
export class CompanyCustomList{
    listId: number = -1;
    listTitle: string = "";
    filter: string = "";
    isPublic: number;
    type: string;
    filterParsed: CompanyFilter = new CompanyFilter();
    constructor(reg){
        this.listId = reg.list ? reg.list : -1;
        this.filterParsed = reg.filterParsed ? reg.filterParsed : new CompanyFilter();
    }
}
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
    modifiedDate: Date;
    isHovered:boolean;
    avatar:string;
    constructor(reg){
        this.companyId = reg.companyId?reg.companyId:-1;
    }
}
export interface Activity {
    activityId: string;
    userId: string;
    userName: string;
    activityType: string;
    activityTypeId: string;
    activityStatus: number;
    createdDate: string;
    icon?: string;
    createdBy: string;
}
export interface Industry{
    industryId:number,
    industryTitle:string
}