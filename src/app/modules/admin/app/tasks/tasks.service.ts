import { ChangeDetectorRef, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { Tag, Task } from './tasks.types';
import { UserService } from 'app/core/user/user.service';

@Injectable({
    providedIn: 'root'
})
export class TasksService
{
    private readonly getTagListURL = `${environment.url}/Tags/all`
    private readonly saveTagURL = `${environment.url}/Company/save`
    private readonly deleteTagURL = `${environment.url}/Company/delete`
    private readonly getTaskListURL = `${environment.url}/Industry/all`
    private readonly saveTaskListURL = `${environment.url}/Users/all`
    private readonly deleteTaskListURL = `${environment.url}/Users/all`

    user: User;
    
    // Private
    private _tags: BehaviorSubject<Tag[] | null> = new BehaviorSubject(null);
    private _task: BehaviorSubject<Task | null> = new BehaviorSubject(null);
    private _tasks: BehaviorSubject<Task[] | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient,
        private _userService: UserService,
    ) {
        this._userService.user$.subscribe(user => {
            this.user = user;
        })
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for tags
     */
    get tags$(): Observable<Tag[]>
    {
        return this._tags.asObservable();
    }

    /**
     * Getter for task
     */
    get task$(): Observable<Task>
    {
        return this._task.asObservable();
    }

    /**
     * Getter for tasks
     */
    get tasks$(): Observable<Task[]>
    {
        return this._tasks.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get tags
     */
    getTags(): Observable<Tag[]>
    {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
          }
          return this._httpClient.post<Tag[]>(this.getTagListURL, data).pipe(
            tap((tags) => {
              this._tags.next(tags);
            })
          );
    }

    /**
     * Crate tag
     *
     * @param tag
     */
    createTag(tag: Tag): Observable<Tag>
    {
        return this.tags$.pipe(
            take(1),
            switchMap(tags => this._httpClient.post<Tag>('api/apps/tasks/tag', {tag}).pipe(
                map((newTag) => {

                    // Update the tags with the new tag
                    this._tags.next([...tags, newTag]);

                    // Return new tag from observable
                    return newTag;
                })
            ))
        );
    }

    /**
     * Update the tag
     *
     * @param id
     * @param tag
     */
    updateTag(id: string, tag: Tag): Observable<Tag>
    {
        return this.tags$.pipe(
            take(1),
            switchMap(tags => this._httpClient.patch<Tag>('api/apps/tasks/tag', {
                id,
                tag
            }).pipe(
                map((updatedTag) => {

                    // Find the index of the updated tag
                    const index = tags.findIndex(item => item.tagId === id);

                    // Update the tag
                    tags[index] = updatedTag;

                    // Update the tags
                    this._tags.next(tags);

                    // Return the updated tag
                    return updatedTag;
                })
            ))
        );
    }

    /**
     * Delete the tag
     *
     * @param id
     */
    deleteTag(id: string): Observable<boolean>
    {
        return this.tags$.pipe(
            take(1),
            switchMap(tags => this._httpClient.delete('api/apps/tasks/tag', {params: {id}}).pipe(
                map((isDeleted: boolean) => {

                    // Find the index of the deleted tag
                    const index = tags.findIndex(item => item.tagId === id);

                    // Delete the tag
                    tags.splice(index, 1);

                    // Update the tags
                    this._tags.next(tags);

                    // Return the deleted status
                    return isDeleted;
                }),
                filter(isDeleted => isDeleted),
                switchMap(isDeleted => this.tasks$.pipe(
                    take(1),
                    map((tasks) => {

                        // Iterate through the tasks
                        tasks.forEach((task) => {

                            const tagIndex = task.tags.findIndex(tag => tag === id);

                            // If the task has a tag, remove it
                            if ( tagIndex > -1 )
                            {
                                task.tags.splice(tagIndex, 1);
                            }
                        });

                        // Return the deleted status
                        return isDeleted;
                    })
                ))
            ))
        );
    }

    /**
     * Get tasks
     */
    getTasks(): Observable<Task[]>
    {
        return this._httpClient.get<Task[]>('api/apps/tasks/all').pipe(
            tap((response) => {
                this._tasks.next(response);
            })
        );
    }

    /**
     * Update tasks orders
     *
     * @param tasks
     */
    updateTasksOrders(tasks: Task[]): Observable<Task[]>
    {
        return this._httpClient.patch<Task[]>('api/apps/tasks/order', {tasks});
    }

    /**
     * Search tasks with given query
     *
     * @param query
     */
    searchTasks(query: string): Observable<Task[] | null>
    {
        return this._httpClient.get<Task[] | null>('api/apps/tasks/search', {params: {query}});
    }

    /**
     * Get task by id
     */
    getTaskById(id: string): Observable<Task>
    {
        return this._tasks.pipe(
            take(1),
            map((tasks) => {

                // Find the task
                const task = tasks.find(item => item.id === id) || null;

                // Update the task
                this._task.next(task);

                // Return the task
                return task;
            }),
            switchMap((task) => {

                if ( !task )
                {
                    return throwError('Could not found task with id of ' + id + '!');
                }

                return of(task);
            })
        );
    }

    /**
     * Create task
     *
     * @param type
     */
    createTask(type: string): Observable<Task>
    {
        return this.tasks$.pipe(
            take(1),
            switchMap(tasks => this._httpClient.post<Task>('api/apps/tasks/task', {type}).pipe(
                map((newTask) => {

                    // Update the tasks with the new task
                    this._tasks.next([newTask, ...tasks]);

                    // Return the new task
                    return newTask;
                })
            ))
        );
    }

    /**
     * Update task
     *
     * @param id
     * @param task
     */
    updateTask(id: string, task: Task): Observable<Task>
    {
        return this.tasks$
                   .pipe(
                       take(1),
                       switchMap(tasks => this._httpClient.patch<Task>('api/apps/tasks/task', {
                           id,
                           task
                       }).pipe(
                           map((updatedTask) => {

                               // Find the index of the updated task
                               const index = tasks.findIndex(item => item.id === id);

                               // Update the task
                               tasks[index] = updatedTask;

                               // Update the tasks
                               this._tasks.next(tasks);

                               // Return the updated task
                               return updatedTask;
                           }),
                           switchMap(updatedTask => this.task$.pipe(
                               take(1),
                               filter(item => item && item.id === id),
                               tap(() => {

                                   // Update the task if it's selected
                                   this._task.next(updatedTask);

                                   // Return the updated task
                                   return updatedTask;
                               })
                           ))
                       ))
                   );
    }

    /**
     * Delete the task
     *
     * @param id
     */
    deleteTask(id: string): Observable<boolean>
    {
        return this.tasks$.pipe(
            take(1),
            switchMap(tasks => this._httpClient.delete('api/apps/tasks/task', {params: {id}}).pipe(
                map((isDeleted: boolean) => {

                    // Find the index of the deleted task
                    const index = tasks.findIndex(item => item.id === id);

                    // Delete the task
                    tasks.splice(index, 1);

                    // Update the tasks
                    this._tasks.next(tasks);

                    // Return the deleted status
                    return isDeleted;
                })
            ))
        );
    }
}
