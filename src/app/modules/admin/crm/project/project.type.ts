import { DecimalPipe } from "@angular/common"

export class Project {
    projectId: number
    title: string
    companyId: number
    code: string
    budget: number
    description: string
    isHovered: boolean
    constructor(reg){
        this.projectId = reg.projectId? reg.projectId: -1;
    }
}
export class Company{
    companyId: number;
    name: string;
    constructor(reg){
        this.companyId = reg.companyId?reg.companyId:-1;
    }
}