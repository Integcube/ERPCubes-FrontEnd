export class Question {
    questionId: number;
    code: string;
    title: number;
    order: number;
    productId: number;
    weightage: number;
    tenantId: number;
    isHovered: boolean;
    constructor(reg) {
        this.questionId = reg.questionId ? reg.questionId : -1;
    }
}


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
        this.projectId = reg.projectId?reg.projectId:-1;
    }
}