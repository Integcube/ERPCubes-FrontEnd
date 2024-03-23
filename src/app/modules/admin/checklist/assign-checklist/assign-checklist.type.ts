export class Assign{
    execId: number;
    title: string;
    cLId: number;
    dueDays: number;
    isRequired: number;
    assignTo: string;
    cPId:number;
    dueDate:Date
    constructor(reg){
        this.execId = reg.execId?reg.execId:-1;
    }

}

export class DashboardView{
    viewName:string
    completed:boolean
    viewId:number
    icon:string
}