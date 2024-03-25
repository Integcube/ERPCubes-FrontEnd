export class DashboardView{
    viewName:string
    completed:boolean
    viewId:number
    icon:string
}

export class Checklist{
    cLId: number;
    title: string;
    description: number;
    createdDate: Date;
    modifiedDate: Date;
    isHovered: boolean;
    createdBy: string;
    checkpoints: CheckPoint[];
    constructor(reg){
        this.cLId = reg.cLId?reg.cLId:-1;
        this.checkpoints = [];

    }

}

export class CheckPoint{
    cLPId: number;
    title: string;
    description: string;
    dueDays: number;
    isRequired: number;
    createdDate: Date;
    modifiedDate: Date;
    createdBy: string;
    constructor(reg){
        this.cLPId = reg.cLPId?reg.cLPId:-1;
        this.title = reg.title?reg.title:"";
        this.description = reg.description?reg.description:"";
        this.dueDays = reg.dueDays?reg.dueDays:null;
        this.isRequired = reg.isRequired?reg.isRequired:0;
    }
}
// export class CheckPoints{
//     cLPId: number;
//     description: string;
//     cLId: number
//     constructor(reg) {
//         this.cLPId = reg.cLPId ? reg.cLPId : -1
//     }
// }