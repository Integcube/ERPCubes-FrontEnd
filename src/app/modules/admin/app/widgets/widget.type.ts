export class TotalLeadSource{
   source: string = "";
   totalLeads: number;
}
export class TotalLeadMonth{
   monthName: string = "";
   totalLeadsCount: number;
}  
export class TotalLeadOwner{
   leadOwnerName: string = "";
   totalLeads: number;
}
export class TotalLeadSummary{
   totalLeads: number;
   totalNewLeads: number;
   totalQualifiedLeads: number;
   totalLostLeads: number;
   totalWonLeads: number;
}

export class Filter{
   status: number;
   tenantId: number;
   days: number;
   constructor(reg) {
      this.status = reg.status ? reg.status : -1,
      this.days = reg.days ? reg.days : -1

}
}
export class Count{
   count: number;
   newCount: number;
}