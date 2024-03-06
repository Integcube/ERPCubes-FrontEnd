export class Dashboard{
    dashboardId: number;
    name: string;
    status: string;
    isPrivate: number;
    widgets: string;
    createdDate: Date;
    modifiedDate: Date;
    isHovered: boolean;
    constructor(reg){
        this.dashboardId = reg.dashboardId?reg.dashboardId:-1;
    }

}