export class Product{

    productId: number;
    productName: string;
    description: string = '';
    price: number;
    projectId: number;
    tenantId: number;
    isHovered: boolean;
    constructor(reg){
        this.productId = reg.productId?reg.productId:-1;
    }
}
export class Project {
    projectId: string
    title: string
    constructor(reg){
        this.projectId = reg.projectId? reg.projectId: -1;
    }
}