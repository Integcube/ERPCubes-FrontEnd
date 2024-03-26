export class Checklist{
    cLId: number;
    title: string;
    description: number;
    createdDate: Date;
    modifiedDate: Date;
    isHovered: boolean;
    createdBy: string;
    constructor(reg){
        this.cLId = reg.cLId?reg.cLId:-1;

    }

}