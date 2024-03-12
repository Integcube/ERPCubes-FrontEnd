export class Dashboard{
    dashboardId: number;
    name: string;
    status: string;
    isPrivate: number;
    widgets: string;
    createdDate: Date;
    modifiedDate: Date;
    isHovered: boolean;
    createdBy: string;
    constructor(reg){
        this.dashboardId = reg.dashboardId?reg.dashboardId:-1;
    }

}
export class DashboardView{
    viewName:string
    completed:boolean
    viewId:number
    icon:string
}
export class DashboardWidget{
    dashboardId: number;
    widgets: string;
}