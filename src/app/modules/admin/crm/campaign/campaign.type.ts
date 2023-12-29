export class Campaign {
    campaignId: string
    adAccountId: string
    title: string
    productId: number
    sourceId: number
    budget: string
    isHovered: boolean
    constructor(reg){
        this.campaignId = reg.campaignId? reg.campaignId : "-1";
        this.adAccountId = reg.adAccountId? reg.adAccountId : "-1";
    }
}

export class Product{

    productId: number;
    productName: string;
    description: string = '';
    price: number;
    tenantId: number;
    isHovered: boolean;
    constructor(reg){
        this.productId = reg.productId?reg.productId:-1;
    }
}

export class Source{
    sourceId: number;
    sourceTitle: string;
    constructor(reg){
        this.sourceId = reg.sourceId?reg.sourceId:-1;
    }
}