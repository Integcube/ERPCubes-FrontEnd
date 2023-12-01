export class Product{

    productId: number;
    productName: string;
    description: string = '';
    price: number;
    tenantId: number;
    isHovered: boolean;
    constructor(reg){
        this.productId = reg.productId?reg.productId:-1;
    }
}