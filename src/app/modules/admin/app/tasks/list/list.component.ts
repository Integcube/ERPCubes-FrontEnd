import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDrawer } from '@angular/material/sidenav';
import { filter, fromEvent, Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { Tag,Task } from '../tasks.types';
import { TasksService } from '../tasks.service';


@Component({
    selector       : 'tasks-list',
    templateUrl    : './list.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksListComponent implements OnInit, OnDestroy
{
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;

    drawerMode: 'over' | 'over';
    selectedTask: Task;
    tags: Tag[];
    tasks: Task[];
    tasksCount: any = {
        completed : 0,
        incomplete: 0,
        total     : 0
    };
    private _unsubscribeAll: Subject<any> = new Subject<any>();


    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(DOCUMENT) private _document: any,
        private _router: Router,
        private _tasksService: TasksService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService
    )
    {
    }

    ngOnInit(): void
    {

        this._tasksService.tags$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((tags: Tag[]) => {
                this.tags = tags;
                this._changeDetectorRef.markForCheck();
            });

        this._tasksService.tasks$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((tasks: Task[]) => {
                this.tasks = tasks;
                this.tasksCount.total = this.tasks.filter(task => task.taskType === 'task').length;
                this.tasksCount.completed = this.tasks.filter(task => task.taskType === 'task' && task.status === 1).length;
                this.tasksCount.incomplete = this.tasksCount.total - this.tasksCount.completed;
                this._changeDetectorRef.markForCheck();
                setTimeout(() => {
                    const mainNavigationComponent = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>('mainNavigation');
                    if ( mainNavigationComponent )
                    {
                        const mainNavigation = mainNavigationComponent.navigation;
                        const menuItem = this._fuseNavigationService.getItem('application.tasks', mainNavigation);
                        menuItem.subtitle = this.tasksCount.incomplete + ' remaining tasks';
                        mainNavigationComponent.refresh();
                    }
                });
            });

        this._fuseMediaWatcherService.onMediaQueryChange$('(min-width: 1440px)')
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((state) => {
                this.drawerMode = state.matches ? 'over' : 'over';
                this._changeDetectorRef.markForCheck();
            });
        fromEvent(this._document, 'keydown')
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter<KeyboardEvent>(event =>
                    (event.ctrlKey === true || event.metaKey) 
                    && (event.key === '/' || event.key === '.') 
                )
            )
            .subscribe((event: KeyboardEvent) => {
                if ( event.key === '/' )
                {
                    this.createTask('task');
                }
                if ( event.key === '.' )
                {
                    this.createTask('section');
                }
            });
    }

    ngOnDestroy(): void
    {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    onBackdropClicked(): void
    {
        this._router.navigate(['./'], {relativeTo: this._activatedRoute});
        this._changeDetectorRef.markForCheck();
    }

    createTask(type: 'task' | 'section'): void
    {
        let newTask: Task = new Task();
        newTask.taskType = type;     
        if(type=="task"){
            newTask.taskId = -1;
        }
        else{
            newTask.taskId = -2;
        }
        this._router.navigate(['./', newTask.taskId], { relativeTo: this._activatedRoute});
        this._changeDetectorRef.markForCheck();
    }

    toggleStatus(task: Task): void {
        let date = new Date;
        let dueDate = new Date(task.dueDate);
        switch (task.status) {
            case 1: {
                if (date > dueDate) {
                    task.status = 4;
                }
                else {
                    task.status = 3
                }
                break;
            }
            case 2: {
                task.status = 1
                break;
            }
            case 3: {
                task.status = 2
                break;
            }
            default: {
                task.status = 1
                break;
            }
        }         this._tasksService.updateTaskStatus(task).pipe(takeUntil(this._unsubscribeAll)).subscribe()
        this._changeDetectorRef.markForCheck();
    }

    dropped(event: CdkDragDrop<Task[]>): void
    {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        event.container.data.forEach((a, index)=>a.order = index)
        this._tasksService.updateTaskOrders(event.container.data).subscribe();
        this._changeDetectorRef.markForCheck();
    }
    
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
