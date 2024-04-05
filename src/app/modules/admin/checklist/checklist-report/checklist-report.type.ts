export class ChecklistReport {
    execId: number;
    referenceno: string = '';
    title: string = '';
    total?: number;
    executedCount?: number;
    notExecutedCount?: number;
    executedPercentage?: number;
}
export class ChecklistReportFilter {
    startDate: Date;
    endDate: Date;
    tenantId: number;
    id: string;
    constructor(reg) {

        const currentDate = new Date();
        if (reg.startDate === null || reg.startDate === undefined) {
            const currentDate = new Date();
            this.startDate = new Date(currentDate.getFullYear(),currentDate.getMonth(),1);
        } else {
            this.startDate = reg.startDate;
        }
        this.endDate = reg.endDate?reg.endDate: this.endDate = new Date(currentDate.getFullYear(),currentDate.getMonth()+1,0);
       
    }
}