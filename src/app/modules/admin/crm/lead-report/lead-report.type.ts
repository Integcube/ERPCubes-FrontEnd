export interface LeadReport {
    leadOwnerId: string
    leadOwnerName:string  
    status: string
    sId: number
    prodName: string
    prodId: number
    count: number
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