export interface Tag
{
    tagId?: number;
    tagTitle?: string;
    isSelected: boolean;
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
