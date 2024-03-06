export class TotalLeadCount {
   totalLeads?: number;
}
export class TotalNewCount{
   totalNewLeads?: number;
} 
export class TotalQualifiedCount{
   totalQualifiedLeads?: number;
}
export class TotalLostCount{
   totalLostLeads?: number;
}
export class TotalWonCount{
   totalWonLeads?: number;
}
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