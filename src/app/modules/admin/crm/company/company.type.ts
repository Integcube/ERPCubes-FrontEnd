export class Company{

    companyId: number;
    tenantId: number;
    name: string = '';
    website: string = '';
    salesOwner: number;
    assignedTo: number;
    mobile: string = '';
    work: string = '';
    billingAddress: string = '';
    billingStreet: string = '';
    billingCity: string = '';
    billingZIP: string = '';
    billingState: string = '';
    billingCountry: string = '';
    deliveryAddress: string = '';
    deliveryStreet: string = '';
    deliveryCity: string = '';
    deliveryZIP: string = '';
    deliveryState: string = '';
    deliveryCountry: string = '';
    companySourceId: number;
    companyIndustryId: number;
    createdDate: Date;
    constructor(reg){
        this.companyId = reg.companyId?reg.companyId:-1;
    }
}