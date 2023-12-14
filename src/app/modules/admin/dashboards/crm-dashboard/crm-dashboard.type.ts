export interface Lead {
    leadId: number;
    firstName: string;
    lastName: string;
    email: string;
    status: number;
    statusTitle: string;
    leadOwner: string;
    mobile: string;
    work: string;
    address: string;
    street: string;
    city: string;
    zip: string;
    state: string;
    country: string;
    sourceId: number;
    sourceTitle: string;
    industryId: number;
    industryTitle: string;
    productId: number;
    productTitle: string;
    createdDate: Date;
    modifiedDate: Date;
    isHovered: boolean;
    avatar: any;
}
export class Task
{
    taskId: number;
    taskTitle: string;
    taskType: 'task' | 'section';
    dueDate: Date | null;
    priority:number;
    order: number;
    status:number;
    statusTitle:string;
    description:string;
    taskOwner:string;
    createdBy:string;
    createdDate:Date;
}
