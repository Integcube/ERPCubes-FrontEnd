export class Chatbot {
    id: number;
    title:string;
    primaryColor: string;
    tenantId: number;
    userId:string;

    constructor(reg) {
        this.id = reg.id ? reg.id : -1
    }
}