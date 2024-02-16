export class Question {
    questionId: number;
    code: string;
    title: number;
    order: number;
    productId: number;
    weightage: number;
    isChecked:boolean
    constructor(reg) {
        this.title = reg.title ? reg.title : "New Question";
        this.order = reg.order ? reg.order : -1;
        this.weightage = reg.weightage ? reg.weightage : 0.1;
        this.questionId = reg.questionId ? reg.questionId : -1;
    }
}


export interface Product{
    productId: number;
    productName: string;
    description: string;
    price: number;
    projectId: number;
    tenantId: number;
    isHovered: boolean;
}