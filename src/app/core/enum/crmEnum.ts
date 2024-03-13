export class ContactEnum {
    All:number
    Lead:number
    Company:number
    Opportunity:number
    constructor() {
        this.All=-1;
        this.Lead=1;
        this.Company=2;
        this.Opportunity=3;
    }
}
export class StatusEnum {
    All:number
    New:number
    Contacted:number
    Interested:number
    Qualified:number
    Lost:number
    Won:number
    constructor() {
        this.All=-1;
        this.New=1;
        this.Contacted=2;
        this.Interested=3;
        this.Qualified=4;
        this.Lost=5;
        this.Won=6;
    }
}