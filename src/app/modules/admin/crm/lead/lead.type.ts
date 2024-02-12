import { formatDate } from "@angular/common";

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
    companyId:number;
    companyTitle:string="";
    sourceTitle: string = "";
    industryId: number;
    industryTitle: string = "";
    productId: number;
    productTitle: string = "";
    campaignId: string = "";
    campaignTitle: string = "";
    createdDate: Date;
    modifiedDate: Date;
    isHovered: boolean;
    avatar: any;
    rating: any;
    constructor(reg) {
        this.leadId = reg.leadId ? reg.leadId : -1;
        this.status = reg.status ? reg.status : 1;
        this.leadOwner = reg.leadOwner ? reg.leadOwner : -1;
        this.sourceId = reg.sourceId ? reg.sourceId : -1;
        this.industryId = reg.industryId ? reg.industryId : -1;
        this.productId = reg.productId ? reg.productId : -1;
        this.createdDate = reg.createdDate ? reg.createdDate : Date.now;
        this.campaignId=reg.campaignId ? reg.campaignId : "-1";
        this.rating = reg.rating ? reg.rating : 0;
        
    }
}
export interface LeadSource {
    sourceId: number;
    sourceTitle: string;
}
export interface LeadStatus {
    statusId: number;
    statusTitle: string;
    isDeletable: number;
    order: number;
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

export class DeletedLead {
    leadId: number;
    name: string = "";
    status: number;
    statusTitle: string = "";
    leadOwner: string = "";
    leadOwnerName: string = "";
    productId: number;
    productTitle: string = "";
    campaignId: string = "";
    campaignTitle: string = "";
    createdDate: Date;
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
export interface Industry {
    industryId: number,
    industryTitle: string
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
    tasks: Tasks[];
   
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

export class LeadList{
    ad_id:string;
    ad_name:string;
    created_time:Date;
    form_id:string;
    id:string;
    firstName:string;
    lastName:string;
    city:string;
    email:string
    leadId:number = -1
    sourceId:number = 4;
    productId:number = 15;
}
export class LeadImportList {
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
    companyTitle:string="";
    sourceTitle: string = "";
    industryTitle: string = "";
    productTitle: string = "";
    createdDate: Date;
    modifiedDate: Date;
    isHovered: boolean;
    product: Product;
    industry: Industry;
    avatar: any;
    constructor(reg) {
        this.leadId = reg.leadId ? reg.leadId : -1;
        this.status = reg.status ? reg.status : 0;
        this.createdDate = reg.createdDate ? reg.createdDate : Date.now;
        this.leadOwner = reg.leadOwner ? reg.leadOwner : "-1";

    }
}
export interface EventType {
    typeId: number,
    typeTitle: string
}

export interface Campaign {
    campaignId: string
    adAccountId: string
    title: string
    productId: number
    sourceId: number
    budget: number
    isHovered: boolean
}

export interface StatusWiseLeads {
    statusId: number;
    statusTitle: string;
    order: number;
    leads: StatusLeads[];
}

export interface StatusLeads {
    leadId: number;
    firstName: string;
    lastName: string;
    email: string;
    status: number;
    leadOwner: string;
    mobile: string;
}
export class DeletedLeads{
    leadId: number;
    firstName: string = "";
    deletedBy: string = '';
    avatar: any;
    deletedDate: Date;
    constructor(reg){
        this.leadId = reg.productId?reg.leadId:-1;
    }
}

