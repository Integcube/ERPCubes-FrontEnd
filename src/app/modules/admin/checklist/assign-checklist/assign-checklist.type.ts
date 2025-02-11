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

export class CheckListInfo{
    clId: number;
    execId:number;
    remarks: string;
    referenceno:string;
    userId:string;
    constructor(reg){
        this.execId = reg.execId?reg.execId:-1;
        this.clId = reg.execId?reg.execId:-1;
        this.remarks=reg.remarks?reg.remarks:"";
        this.referenceno=reg.referenceno?reg.referenceno:"";
        this.userId="-1";
        
    }

}


export class DashboardView{
    viewName:string
    completed:boolean
    viewId:number
    icon:string
}