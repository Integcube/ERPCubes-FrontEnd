export interface Activity
{
    activityId: string;
    userId: string;
    userName: string;
    activityType: string;
    activityTypeId: string;
    activityStatus: number;
    image?: string;
    detail?: string;
    createdDate: string;
    icon?: string;
    createdBy: string;
}
