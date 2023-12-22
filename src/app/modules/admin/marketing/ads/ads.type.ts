export interface AdAccounts{
    id:string,
    name:string,
    adaccounts:AdAccountDetail
}
export interface AdAccountDetail{
    data:AdAccountList[],
    paging:any,
}
export interface AdAccountList{
    account_id:string,
    id:string,
    isSelected:boolean,
    title:string,

}
export interface AdAcountName{
    name: string
}
export interface Product {
    productId: number;
    productName: string;
    description: string;
    price: number;
}
export interface AdList {
    name: number;
    id: string;
    productId: number;
}

export class LeadList{
    ad_id:string;
    ad_name:string;
    created_time:Date;
    form_id:string;
    id:string;
    firstName:string;
    lastName:string;
    city:string;
    email:string
    leadId:number = -1
    sourceId:number = 4;
    field_data:LeadForm[];
}
export interface LeadForm{
    name:string;
    values:string[];
}