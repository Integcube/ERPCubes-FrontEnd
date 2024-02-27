export class Opportunity {
    opportunityId: number
    opportunityOwner: string
    firstName: string = "";
    lastName: string = "";
    email: string = "";
    statusId: number;
    statusTitle: string = "";
    mobile: string = "";
    work: string = "";
    address: string = "";
    street: string = "";
    city: string = "";
    zip: string = "";
    state: string = "";
    country: string = "";
    sourceId: number;
    sourceTitle: string = "";
    industryId: number;
    industryTitle: string = "";
    productId: number;
    productTitle: string = "";
    createdDate: Date;
    modifiedDate: Date;
    avatar: any
    isHovered: boolean;
    constructor(reg) {
        this.opportunityId = reg.opportunityId ? reg.opportunityId : -1;
        this.statusId = reg.statusId ? reg.statusId : 0;
        this.sourceId = reg.sourceId ? reg.sourceId : 0;
        this.industryId = reg.industryId ? reg.industryId : 0;
        this.productId = reg.productId ? reg.productId : 0;
        this.createdDate = reg.createdDate ? reg.createdDate : Date.now;
    }
}
export class OpportunitySource {
    sourceId: number
    sourceTitle: string
}
export interface OpportunityStatus {
    statusId: number;
    statusTitle: string;
    isDeletable: number;
    order: number;
}
export class OpportunityCustomList {
    listId: number = -1;
    listTitle: string = "";
    filter: string = "";
    isPublic: number;
    type: string;
    filterParsed: OpportunityFilter = new OpportunityFilter();
    constructor(reg) {
        this.listId = reg.list ? reg.list : -1;
        this.filterParsed = reg.filterParsed ? reg.filterParsed : new OpportunityFilter();
    }
}
export class OpportunityFilter {
    opportunityOwner: string[] = [];
    createdDate: Date = null;
    modifiedDate: Date = null;
    opportunityStatus: number[] = [];
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
export interface Industry {
    industryId: number,
    industryTitle: string
}
export class Email {
    emailId: number;
    subject: string;
    description: string;
    createdBy: string;
    createdDate: Date;
    createdbyName:string;
    constructor(reg) {
        this.emailId = reg.emailId ? reg.emailId : -1
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
export class Note {
    noteId: number;
    noteTitle: string;
    content: string;
    createdDate: Date;
    createdBy: string;
    userName: string;
    createdByName: string;
    tags: Tag[];
    tasks: Task[];
    constructor(reg) {
        this.noteId = reg.noteId ? reg.noteId : -1
    }
}
export interface Product {
    productId: number;
    productName: string;
    description: string;
    price: number;
}
export class Tag {
    tagId: number;
    tagTitle: string;
    isSelected: boolean
    constructor(reg) {
        this.tagId = reg.tagId ? reg.tagId : -1
    }
}
export class Task {
    taskId: number;
    task: string;
    isCompleted: boolean;
    noteId: number
    constructor(reg) {
        this.taskId = reg.taskId ? reg.taskId : -1
    }
}

export interface EventType {
    typeId: number,
    typeTitle: string
}
export class TaskModel {
    taskId: number;
    taskTitle: string;
    dueDate: Date;
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

export class Attachment {
    fileId: number;
    fileName: string;
    path: string;
    description: string;
    type: string;
    size: number;
}

