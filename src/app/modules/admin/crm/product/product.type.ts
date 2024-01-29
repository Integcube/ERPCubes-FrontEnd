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
    projectId: number
    title: string
    constructor(reg){
        this.projectId = reg.projectId? reg.projectId: -1;
    }
}

export class ProductImportList{

    productName: string;
    description: string;
    price: number;
    projectId: number;
    tenantId: number;
    constructor(reg){
        this.productName = reg.productName ? reg.productName: '';
        this.description = reg.description ? reg.description: '';
        this.price = reg.price ? reg.price: 0;
        this.projectId = reg.projectId ? reg.projectId: -1;
    }
}