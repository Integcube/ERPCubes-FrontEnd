export class DashboardView{
    viewName:string
    completed:boolean
    viewId:number
    icon:string
}

export class Checklist{
    clId: number;
    title: string;
    description: number;
    createdDate: Date;
    modifiedDate: Date;
    createdBy: string;
    checkpoints: CheckPoint[];
    constructor(reg){
        this.clId = reg.clId?reg.clId:-1;
        this.checkpoints = [];

    }

}

export class CheckPoint{
    cpId: number;
    cLPId: number;
    title: string;
    description: string;
    dueDays: number;
    isRequired: boolean;
    priority: number;
    createdDate: Date;
    modifiedDate: Date;
    createdBy: string;
    isDeleted:number;
    constructor(reg){
        this.cpId = reg.cpId?reg.cpId:-1;
        this.title = reg.title?reg.title:"";
        this.description = reg.description?reg.description:"";
        this.dueDays = reg.dueDays?reg.dueDays:null;
        this.isRequired = reg.isRequired?reg.isRequired:0;
        this.isDeleted = 0;
        
    }
}


export class CkContactCheckList{
    ccLId: number; 
    clId: number;
    statusId: number;
    contactTypeId: number;
    createdBy: string;
    createdDate: Date;
}