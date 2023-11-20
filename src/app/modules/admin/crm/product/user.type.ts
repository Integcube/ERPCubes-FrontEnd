export class UserForm{

    id: any;
    firstName: String;
    lastName: String;
    userName: String;
    email: String;
    phoneNumber: String;
    passwordHash: String;
    tenantId: number;
    isHovered: boolean;
    constructor(reg){
        this.id = reg.userId?reg.id:-1;
    }
}