export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    status?: string;
    userName: string;
    tenantId: number;
    tenantGuid: string;
    isDocumentAcces: number;
}

export interface Pagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export class PaginationView {
    pageIndex: number;
    pageSize: number;
    active: string;
    direction: string;
    search: string;
    constructor(reg) {
        this.pageIndex = reg.pageIndex ? reg.pageIndex : 0;
        this.pageSize = reg.pageSize ? reg.pageSize : 10;
        this.active = reg.active ? reg.active : "";
        this.direction = reg.direction ? reg.direction : "asc";
        this.search = reg.search ? reg.search : "";
    }
}


