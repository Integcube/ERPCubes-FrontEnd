export interface Item
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
}
