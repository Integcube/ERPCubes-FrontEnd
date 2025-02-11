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
    constructor(reg) {
        this.callId = reg.callId ? reg.callId : -1
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
    constructor(reg){
        this.meetingId = reg.meetingId?reg.meetingId:-1
    }
}
export class Note {
    noteId: number;
    noteTitle: string;
    content: string;
    createdDate: Date;
    createdBy: string;
    userName: string;
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
    constructor(reg) {
        this.taskId = reg.taskId ? reg.taskId : -1
    }
}
