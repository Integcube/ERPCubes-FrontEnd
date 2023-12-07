export interface LeadReport {
    leadOwner: string
    leadOwnerName:string
    statusTitle: string
    statusId: number
    productName: string
    productId: number
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