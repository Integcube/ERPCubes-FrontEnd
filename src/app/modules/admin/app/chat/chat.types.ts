export interface Ticket {
    ticketId: number;
    socialMediaPlatform: string;
    customerId: string;
    timestamp: Date;
    status: number;
    assigneeId: string;
    priority: number;
    type:number;
    category: string;
    resolutionStatus: string;
    dueDate: Date;
    recentlyActive: Date;
    notes: string;
    latestConversation: Conversation;
    tenantId: number;
}

export class Conversation {
    conversationId: number;
    ticketId: number;
    fromId: string;
    toId: string;
    timestamp: Date;
    isMine:boolean;
    messageType: string;
    messageBody: string;
    mediaType: string;
    readStatus: boolean;
    reaction: string;
    forwardedStatus: boolean;
    location: string;
    messageStatus: string;
    createdDate: Date;
    eventType: string;
    customerFeedback: string;
    tenantId: number;
    constructor(reg) {
        this.conversationId = reg.conversationId ? reg.conversationId : -1;
    }
}
export interface TicketInfo{
    priority: number;
    assigneeId: string;
    type: number;
    status: number;
    notes: string;
    ticketId: number;
}
export interface TicketPriority{
    ticketPriorityId: number;
    priorityName: string;
}
export interface TicketStatus{
    ticketStatusId: number;
    statusName: string;
    class:string
}
export interface TicketType{
    ticketTypeId: number;
    typeName: string;
}