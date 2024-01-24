export class Note {
    noteId: number;
    noteTitle: string;
    content: string;
    id: number;
    createdDate: Date;
    createdBy: string;
    userName: string;
    createdByName: string;
    tags: Tag[];
    tasks: Tasks[];
    constructor(reg) {
        this.noteId = reg.noteId ? reg.noteId : -1
    }
}

export class Tasks {
    taskId: number;
    task: string;
    isCompleted: boolean;
    noteId: number
    constructor(reg) {
        this.taskId = reg.taskId ? reg.taskId : -1
    }
}

export class Tag {
    tagId: number;
    tagTitle: string;
    isSelected: boolean
    constructor(reg) {
        this.tagId = reg.tagId ? reg.tagId : -1
    }
}