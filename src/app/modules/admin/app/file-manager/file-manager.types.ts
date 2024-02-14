export class Item
{
    fileId: number;
    fileName: string;
    description: string;
    type: string;
    path: string;
    parentId: number;
    size: number;
    createdDate: Date;
    createdBy: string;
    modifiedDate: Date;
    modifiedBy: string;
    constructor(reg){
        this.fileId = reg.fileId?reg.fileId:-1;
        this.type =  reg.filetypeId?reg.type:"Folder";
    }
}
