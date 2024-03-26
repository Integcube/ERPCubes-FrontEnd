export interface AssignedCheckPoint{
    cLId: number;
    cPId: number;
    title: string;
    description: string;
    isRequired: number;
    dueDays: number;
    dueDate: Date;
    status: number;
    priority: number;
}

export interface AssignedCheckList {
    title: string;
    createdBy: string;
    description: string;
    assignedDate: Date;
    cLId: number;
    execId: number;
    remarks: string;
}
