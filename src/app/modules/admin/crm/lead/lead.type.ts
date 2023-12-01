
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
export class Lead {
    leadId: number;
    firstName: string = "";
    lastName: string = "";
    email: string = "";
    status: number;
    statusTitle: string = "";
    leadOwner: string = "";
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
    isHovered: boolean;
    avatar: any;
    constructor(reg) {
        this.leadId = reg.leadId ? reg.leadId : -1;
    }
}
export interface LeadStatus {
    statusId: number;
    statusTitle: string;
    isDeletable: number;
    order: number;
}
export interface LeadSource {
    sourceId: number;
    sourceTitle: string;
}
export interface Industry {
    industryId: number,
    industryTitle: string
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
export class LeadCustomList {
    listId: number = -1;
    listTitle: string = "";
    filter: string = "";
    isPublic: number;
    type: string;
    filterParsed: LeadFilter = new LeadFilter();
    constructor(reg) {
        this.listId = reg.list ? reg.list : -1;
        this.filterParsed = reg.filterParsed ? reg.filterParsed : new LeadFilter();
    }
}
export class LeadFilter {
    leadOwner: string[] = [];
    createdDate: Date = null;
    modifiedDate: Date = null;
    leadStatus: number[] = [];
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
