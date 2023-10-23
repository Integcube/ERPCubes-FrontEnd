export interface AuthModelResponse {
    id: string,
    userName: string,
    email: string,
    token: string,
    name:string,
    tenantId:number,
    avatar?: string,
    status?: string,
}