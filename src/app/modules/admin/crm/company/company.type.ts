export class CompanyFilter{
    companyOwner: string[] = [];
    createdDate: Date = null;
    modifiedDate: Date = null;
    industryId: number[] = []
}
export class CompanyCustomList{
    listId: number = -1;
    listTitle: string = "";
    filter: string = "";
    isPublic: number;
    type: string;
    filterParsed: CompanyFilter = new CompanyFilter();
    constructor(reg){
        this.listId = reg.list ? reg.list : -1;
        this.filterParsed = reg.filterParsed ? reg.filterParsed : new CompanyFilter();
    }
}
export class Company{
    companyId: number;
    name: string;
    website: string;
    companyOwner: string;
    mobile?: string;
    work?: string;
    email: string;
    billingAddress?: string;
    billingStreet?: string;
    billingCity?: string;
    billingZip?: string;
    billingState?: string;
    billingCountry?: string;
    deliveryAddress?: string;
    deliveryStreet?: string;
    deliveryCity?: string;
    deliveryZip?: string;
    deliveryState?: string;
    deliveryCountry?: string;
    industryId: number;
    industryTitle: string;
    createdDate: Date;
    modifiedDate: Date;
    isHovered:boolean;
    avatar:string;
    constructor(reg){
        this.companyId = reg.companyId?reg.companyId:-1;
    }
}
export interface Activity {
    activityId: string;
    userId: string;
    userName: string;
    activityType: string;
    activityTypeId: string;
    activityStatus: number;
    createdDate: string;
    icon?: string;
    createdBy: string;
}
export interface Industry{
    industryId:number,
    industryTitle:string
}


export interface Activity {
    activityId: string;
    userId: string;
    userName: string;
    activityType: string;
    activityTypeId: string;
    activityStatus: number;
    createdDate: string;
    icon?: string;
    createdBy: string;
}
export interface Industry{
    industryId:number,
    industryTitle:string
}

export class Note {
    noteId: number;
    noteTitle: string;
    content: string;
    createdDate: Date;
    createdBy: string;
    userName: string;
    tags: Tag[];
    tasks: Tasks[];
    constructor(reg) {
        this.noteId = reg.noteId ? reg.noteId : -1
    }
}
export class Tasks {
    taskId: number;
    task: string;
    isCompleted: boolean;
    noteId: number
    constructor(reg) {
        this.taskId = reg.taskId ? reg.taskId : -1
    }
}
export class Tag {
    tagId: number;
    tagTitle: string;
    isSelected: boolean
    constructor(reg) {
        this.tagId = reg.tagId ? reg.tagId : -1
    }
}
export class TaskModel {
    taskId: number;
    taskTitle: string;
    dueDate: Date | null;
    priority: number;
    status: number;
    description: string | null;
    taskOwner: string;
    taskOwnerTitle: string;
    createdBy: string;
    createdByTitle: string;
    createdDate: Date;
    taskType: string;
    tags: Tag[];
    tasktypeId:number

    constructor(reg) {
        this.taskId = reg.taskId ? reg.taskId : -1
        this.tasktypeId = reg.tasktypeId ? reg.tasktypeId : 5
        this.dueDate = new Date()
    }
}
export class Email {
    emailId: number;
    subject: string;
    description: string;
    createdBy: string;
    createdDate: Date;
    constructor(reg) {
        this.emailId = reg.emailId ? reg.emailId : -1
    }
}
export class Call {
    callId: number;
    subject: string;
    response: string;
    startTime: Date;
    endTime: Date;
    createdBy: string;
    createdDate: Date;
    createdByName: string;
    reasonId: number;
    dueDate: Date | null;
    taskId: number;
    isTask:number;
    tasktime:number;
    callDate:Date| null;
    constructor(reg) {
        this.callId = reg.callId ? reg.callId : -1
        this.reasonId = reg.reasonId ? reg.reasonId : -1
        this.startTime = reg.startTime || new Date(); 
        this.endTime = reg.endTime || new Date(); 
        this.taskId = reg.taskId ? reg.taskId : -1
        this.isTask = reg.isTask ? reg.isTask : -1
        this.callDate = reg.callDate || new Date(); 
    }
}
export class Meeting{
    meetingId: number;
    subject: string;
    note: string;
    startTime: Date;
    endTime: Date;
    createdBy: string;
    createdDate: Date;
    createdbyName:string;
    meetingDate:Date;
    constructor(reg){
        this.meetingId = reg.meetingId?reg.meetingId:-1
        this.startTime = reg.startTime || new Date(); 
        this.endTime = reg.endTime || new Date(); 
        this.meetingDate = reg.meetingDate || new Date(); 
        
    }
}
export interface Activity {
    activityId: string;
    userId: string;
    userName: string;
    activityType: string;
    activityTypeId: string;
    activityStatus: number;
    image?: string;
    detail?: string;
    createdDate: string;
    icon?: string;
    createdBy: string;
}
export interface EventType {
    typeId: number,
    typeTitle: string
}