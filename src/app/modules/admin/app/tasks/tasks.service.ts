import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
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
    private readonly deleteTasksURL = `${environment.url}/Task/delete`
    private readonly getUsersURL = `${environment.url}/Users/all`
    user: User;
    currentDate: Date = new Date();
    private _tags: BehaviorSubject<Tag[] | null> = new BehaviorSubject(null);
    private _task: BehaviorSubject<Task | null> = new BehaviorSubject(null);
    private _tasks: BehaviorSubject<Task[] | null> = new BehaviorSubject(null);
    private _taskTags: BehaviorSubject<Tag[] | null> = new BehaviorSubject(null);
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
    saveTags(tag: string): Observable<Tag> {
        const data = {
            tenantId: this.user.tenantId,
            createdBy: this.user.id,
            tagId: -1,
            tagTitle: tag
        };
        return this._httpClient.post<Tag>(this.saveTagsURL, data).pipe(
            map((response: Tag) => response), // Adjust 'tag' based on your API response structure
            tap(() => {
                this.getTags().subscribe();
            })
        );
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
            id: 1,
            companyId: -1,
            leadId: 1,
            task : {...task.value,
                createdBy: this.user.id,
                taskOwner: this.user.id,
                taskType: "task",}
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
    //Needs to be implmented
    updateTaskOrders(tasks: Task[]): Observable<Task[]> {
        return this._httpClient.patch<Task[]>('api/apps/tasks/order', {tasks});
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
                    return task;
                }
                if(id===-2)
                {
                    const task = new Task();
                    task.taskId =-2;
                    task.taskType = 'section';
                    this._task.next(task);
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
                return of(task);
            })
        );
    }
    getUsers(): Observable<User[]> {
        let data = {
            tenantId: this.user.tenantId,
            id: this.user.id
        }
        return this._httpClient.post<User[]>(this.getUsersURL, data).pipe(
            tap((users) => {
                this._users.next(users);
            })
        );
    }
}
