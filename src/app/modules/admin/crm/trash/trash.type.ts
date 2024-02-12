export class DeletedProducts {
    productId: number;
    productName: string;
    description: string = '';
    deletedBy: string = '';
    avatar: any;
    deletedDate: Date;
  
    constructor(reg) {
      this.productId = reg.productId ? reg.productId : -1;
    }
  }
  
  export class DeletedLeads {
    leadId: number;
    firstName: string = '';
    deletedBy: string = '';
    avatar: any;
    deletedDate: Date;
  
    constructor(reg) {
      this.leadId = reg.leadId ? reg.leadId : -1;
    }
  }
  
  export class DeletedUsers {
    id: any;
    userName: string;
    deletedDate: Date;
    deletedBy: string = '';
    avatar: any;
  
    constructor(reg) {
      this.id = reg.userId ? reg.id : -1;
    }
  }
  