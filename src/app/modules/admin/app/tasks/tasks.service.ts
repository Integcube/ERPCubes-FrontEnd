import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, EMPTY, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { Tag, Task } from './tasks.types';
import { UserService } from 'app/core/user/user.service';
import { FormGroup } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class TasksService
{
    private readonly getTagsURL =  `${environment.url}/Tags/all`
    private readonly saveTagsURL = `${environment.url}/Tags/save`
    private readonly deleteTagsURL = `${environment.url}/Tags/delete`
    private readonly getTasksURL = `${environment.url}/Task/all`
    private readonly saveTasksURL = `${environment.url}/Task/save`
    private readonly updateTaskStatusURL = `${environment.url}/Task/updateStatus`
    private readonly getTasktags = `${environment.url}/Task/tags`
    private readonly deleteTasksURL = `${environment.url}/Task/delete`
    private readonly getUsersURL = `${environment.url}/Users/all`
    private readonly updateTaskOrderURL = `${environment.url}/Task/updateTaskOrder`
    user: User;
    currentDate: Date = new Date();
    private _tags: BehaviorSubject<Tag[] | null> = new BehaviorSubject(null);
    private _task: BehaviorSubject<Task | null> = new BehaviorSubject(null);
    private _tasks: BehaviorSubject<Task[] | null> = new BehaviorSubject(null);
    private _users: BehaviorSubject<User[] | null> = new BehaviorSubject(null);
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
    ) 
    {
        this._userService.user$.subscribe(user => {
            this.user = user;
        })
    }

    get tags$(): Observable<Tag[]> {
        return this._tags.asObservable();
    }
    get task$(): Observable<Task> {
        return this._task.asObservable();
    }
    get tasks$(): Observable<Task[]> {
        return this._tasks.asObservable();
    }
    get users$(): Observable<User[]> {
        return this._users.asObservable();
    }
    getTags(): Observable<Tag[]> {
        let data = {
            tenantId: this.user.tenantId,
            id: this.user.id
        }
        return this._httpClient.post<Tag[]>(this.getTagsURL, data).pipe(
            tap((tags) => {
                this._tags.next(tags)
            })
        );
    }
    saveTags(tag: string, tagId:number): Observable<Tag> {
        const data = {
            tenantId: this.user.tenantId,
            createdBy: this.user.id,
            tagId: tagId,
            tagTitle: tag
        };
        return this._httpClient.post<Tag>(this.saveTagsURL, data).pipe(
            catchError(err => { alert(err.message); return EMPTY })
        )
    }
    deleteTags(id: number): Observable<Tag[]> {
        let data = {
            tenantId: this.user.tenantId,
            tagId: id,
            lastModifiedBy: this.user.id,
        }
        return this._httpClient.post<Tag[]>(this.deleteTagsURL, data).pipe(
            tap(() => {
                this.getTags().subscribe();
            })
        );
    }
    getTasks(): Observable<Task[]> {
        let data = {
            tenantId : this.user.tenantId,
            id: this.user.id,
            leadId: -1,
            companyId: -1
        }
        return this._httpClient.post<Task[]>(this.getTasksURL, data).pipe(
            tap((tasks) => {
                this._tasks.next(tasks)
            })
        );
    }
    saveTasks(task: FormGroup<any>): Observable<Task[]> {
        let data: any = { 
            id: this.user.id,
            companyId: -1,
            leadId: -1,
            tenantId:this.user.tenantId,
            type:task.value.taskType,
            task : {
                taskId:task.value.taskId,
                taskTitle:task.value.taskTitle,
                description:task.value.description,
                priorityId:task.value.priority,
                statusId:task.value.status,
                taskOwner:task.value.taskOwner,
                tags:task.value.tags.join(','),
                dueDate:task.value.dueDate,
               }
        }
        return this._httpClient.post<Task[]>(this.saveTasksURL, data).pipe(
            tap((tasks) => {
                this.getTasks().subscribe();
            })
        );
    }
    updateTaskStatus(task: Task): Observable<Task[]> {
        let data = {
            tenantId: this.user.tenantId,
            Id: this.user.id,
            taskId:task.taskId,
            taskTitle:task.taskTitle,
            status:task.status,
        }
        return this._httpClient.post<Task[]>(this.updateTaskStatusURL, data).pipe(
            tap((tasks) => {
                this.getTasks().subscribe();
            })
        );
    }
    deleteTasks(id: number): Observable<Task[]> {
        let data = {
            tenantId: this.user.tenantId,
            taskId: id
        }
        return this._httpClient.post<Task[]>(this.deleteTasksURL, data).pipe(
            tap((tasks) => {
                this.getTasks().subscribe();
            })
        );
    }
    selectedTask(selectedTask: Task){
        this._task.next(selectedTask);
    }
    updateTaskOrders(tasks: Task[]): Observable<Task[]> {
        let data = {
            tasks
        }
        return this._httpClient.post<Task[]>(this.updateTaskOrderURL, data).pipe(
            tap(() => {
                this.getTags().subscribe();
            })
        );
    }
    getTaskById(id: number): Observable<Task> {
        return this._tasks.pipe(
            take(1),
            map((tasks) => {
                if(id===-1)
                {
                    const task = new Task();
                    task.taskId =-1;
                    task.taskType = 'task';
                    this._task.next(task);
                    this.getTags().subscribe();
                    return task;
                }
                if(id===-2)
                {
                    const task = new Task();
                    task.taskId =-2;
                    task.taskType = 'section';
                    this._task.next(task);
                    this.getTags().subscribe();
                    return task;
                }
                else{
                    const task = tasks.find(item => item.taskId === id) || null;
                    this._task.next(task);
                    return task;
                }
            }),
            switchMap((task) => {
                if ( !task )
                {
                    return throwError('Could not find task with id of ' + id + '!');
                }
                if(task.taskId !== -1 && task.taskId !== -2){
                    let data = {
                        tenantId: this.user.tenantId,
                        id: this.user.id,
                        taskId:id
                    }
                    return this._httpClient.post<Tag[]>(this.getTasktags, data).pipe(
                        tap((tags) => {
                            this._tags.next(tags)
                        }),
                        map(() => task)
                    );
                }
                else{
                    return of(task);
                }
            })
        );
    }
    getUsers(): Observable<User[]> {
        let data = {
            tenantId: this.user.tenantId,
            id: this
            .user.id
        }
        return this._httpClient.post<User[]>(this.getUsersURL, data).pipe(
            tap((users) => {
                this._users.next(users);
            })
        );
    }
}
