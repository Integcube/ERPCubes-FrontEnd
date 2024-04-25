import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { catchError, debounceTime, EMPTY, filter, Subject, takeUntil } from 'rxjs';
import * as moment from 'moment';
import { Tag, Task } from '../tasks.types';
import { TasksListComponent } from '../list/list.component';
import { TasksService } from '../tasks.service';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { formatDate } from '@angular/common';


@Component({
    selector: 'tasks-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('tagsPanelOrigin') private _tagsPanelOrigin: ElementRef;
    @ViewChild('tagsPanel') private _tagsPanel: TemplateRef<any>;
    @ViewChild('titleField') private _titleField: ElementRef;
    users$ = this._tasksService.users$;
    user: User;
    tags: Tag[];
    tagsEditMode: boolean = false;
    filteredTags: Tag[];
    task: Task;
    taskForm: UntypedFormGroup;
    tasks: Task[];
    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _userService: UserService,
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: UntypedFormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _renderer2: Renderer2,
        private _router: Router,
        private _tasksListComponent: TasksListComponent,
        private _tasksService: TasksService,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        private _taskListComponent: TasksListComponent
    ) { }

    setPriority(id: number) {
        this.taskForm.get('priority').patchValue(id);
    }

    save() {

        const dueTime = this.taskForm.get('dueTime').value
        const dueDate = this.taskForm.get('dueDate').value

        const formattedDateTime = `${formatDate(dueDate, "yyyy-MM-dd", "en")}T${dueTime}`
        
        this.taskForm.get('dueDate').patchValue(formattedDateTime);

        let selectedIds: any[] = [];
        this.tags.map(a => {
            if (a.isSelected == true) {
                selectedIds.push(a.tagId);
            }
        })
        this.taskForm.get('tags').patchValue(selectedIds);
        this._tasksService.saveTask(this.taskForm).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            data => {
                this._taskListComponent.onBackdropClicked();
                this.closeDrawer();
                this._changeDetectorRef.markForCheck();
            }
        );
    }
    ngOnInit(): void {
        // Open the drawer
        this._tasksListComponent.matDrawer.open();
        this._userService.user$.subscribe(user => {
            this.user = user;
            this._changeDetectorRef.markForCheck();
        })
        // Create the task form
        debugger;
        this.taskForm = this._formBuilder.group({
            taskId: ['', Validators.required],
            taskType: ['', Validators.required],
            taskTitle: ['', Validators.required],
            description: [''],
            taskOwner: [this.user.id, Validators.required],
            status: [],
            dueDate: [null],
            dueTime: [this.formatTime(new Date())],
            priority: [0],
            tags: [[]],
            order: [0]
        });

        // Get the tags
        this._tasksService.tags$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((tags: Tag[]) => {
                this.tags = tags;
                this.filteredTags = tags;
                this._changeDetectorRef.markForCheck();
            });

        // Get the tasks
        this._tasksService.tasks$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((tasks: Task[]) => {
                this.tasks = tasks;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the task
        this._tasksService.task$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((task: Task) => {
                this._tasksListComponent.matDrawer.open();
                this.task = task;
                this.taskForm.patchValue(task, { emitEvent: false });
                this._changeDetectorRef.markForCheck();
            });
        this._router.events
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter(event => event instanceof NavigationEnd)
            )
            .subscribe(() => {
                this._titleField.nativeElement.focus();
            });
    }

    ngAfterViewInit(): void {
        this._tasksListComponent.matDrawer.openedChange
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter(opened => opened)
            )
            .subscribe(() => {
                this._titleField.nativeElement.focus();
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
        if (this._tagsPanelOverlayRef) {
            this._tagsPanelOverlayRef.dispose();
        }
    }

    formatTime(time: string|Date): string {
        const date = new Date(time);
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        return `${hours}:${minutes}`;
    }

    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._tasksListComponent.matDrawer.close();
    }

    toggleCompleted(): void {
        let date = new Date;
        let dueDate = new Date(this.taskForm.value.dueDate);
        let status = this.taskForm.value.status;

        switch (status) {
            case 1: {
                if (date > dueDate) {
                    status = 4;
                }
                else {
                    status = 3
                }
                break;
            }
            case 2: {
                status = 1
                break;
            }
            case 3: {
                status = 2
                break;
            }
            default: {
                status = 1
                break;
            }
        }
        this.taskForm.get('status').patchValue(status)

    }

    openTagsPanel(): void {
        // Create the overlay
        this._tagsPanelOverlayRef = this._overlay.create({
            backdropClass: '',
            hasBackdrop: true,
            scrollStrategy: this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position()
                .flexibleConnectedTo(this._tagsPanelOrigin.nativeElement)
                .withFlexibleDimensions(true)
                .withViewportMargin(64)
                .withLockedPosition(true)
                .withPositions([
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top'
                    }
                ])
        });

        // Subscribe to the attachments observable
        this._tagsPanelOverlayRef.attachments().subscribe(() => {

            // Focus to the search input once the overlay has been attached
            this._tagsPanelOverlayRef.overlayElement.querySelector('input').focus();
        });

        // Create a portal from the template
        const templatePortal = new TemplatePortal(this._tagsPanel, this._viewContainerRef);

        // Attach the portal to the overlay
        this._tagsPanelOverlayRef.attach(templatePortal);

        // Subscribe to the backdrop click
        this._tagsPanelOverlayRef.backdropClick().subscribe(() => {

            // If overlay exists and attached...
            if (this._tagsPanelOverlayRef && this._tagsPanelOverlayRef.hasAttached()) {
                // Detach it
                this._tagsPanelOverlayRef.detach();

                // Reset the tag filter
                this.filteredTags = this.tags;

                // Toggle the edit mode off
                this.tagsEditMode = false;
            }

            // If template portal exists and attached...
            if (templatePortal && templatePortal.isAttached) {
                // Detach it
                templatePortal.detach();
            }
        });
    }

    toggleProductTag(label: Tag): void {
        const foundLabelIndex = this.tags.findIndex(a => a.tagId === label.tagId);
        this.tags[foundLabelIndex].isSelected = !this.tags[foundLabelIndex].isSelected;
        this._changeDetectorRef.markForCheck();
    }

    toggleTagsEditMode(): void {
        this.tagsEditMode = !this.tagsEditMode;
    }

    filterTags(event): void {
        const value = event.target.value.toLowerCase();
        this.filteredTags = this.tags.filter(tag => tag.tagTitle.toLowerCase().includes(value));
    }

    filterTagsInputKeyDown(event): void {
        // Return if the pressed key is not 'Enter'
        if (event.key !== 'Enter') {
            return;
        }

        // If there is no tag available...
        if (this.filteredTags.length === 0) {
            // Create the tag
            this.createTag(event.target.value);

            // Clear the input
            event.target.value = '';

            // Return
            return;
        }

        // If there is a tag...
        const tag = this.filteredTags[0];
        const isTagApplied = null;
        // const isTagApplied = this.task.tags.find(id => id === tag.id);

        // If the found tag is already applied to the task...
        if (isTagApplied) {
            // Remove the tag from the task
            this.deleteTagFromTask(tag);
        }
        else {
            // Otherwise add the tag to the task
            this.addTagToTask(tag);
        }
    }

    createTag(title: string): void {
        this._tasksService.saveTags(title,-1)
            .subscribe((response) => {
                this.addTagToTask(response);
                this.toggleProductTag(response);
            });
    }

    updateTagTitle(tag: Tag, event): void {
        tag.tagTitle = event.target.value;
        this._tasksService.saveTags(tag.tagTitle, tag.tagId)
            .pipe(debounceTime(300))
            .subscribe();
        this._changeDetectorRef.markForCheck();
    }

    deleteTag(tag: Tag): void {
        this._tasksService.deleteTags(tag.tagId).subscribe(
            data => {
                this.deleteTagFromTask(tag);
            }
        );
    }

    addTagToTask(tag: Tag): void {
        this.tags.unshift(tag);
        this.filteredTags = this.tags;
        this._changeDetectorRef.markForCheck();
    }

    deleteTagFromTask(tag: Tag): void {
        this.tags.splice(this.tags.findIndex(t => t.tagId === tag.tagId), 1);
        this._changeDetectorRef.markForCheck();
    }

    shouldShowCreateTagButton(inputValue: string): boolean {
        return !!!(inputValue === '' || this.tags.findIndex(tag => tag.tagTitle.toLowerCase() === inputValue.toLowerCase()) > -1);
    }

    isOverdue(): boolean {
        return moment(this.taskForm.value.dueDate, moment.ISO_8601).isBefore(moment(), 'days');
    }

    deleteTask(): void {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete task',
            message: 'Are you sure you want to delete this task? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete'
                }
            }
        });
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this._tasksService.deleteTask(this.task.taskId).pipe(
                takeUntil(this._unsubscribeAll))
                .subscribe(
                    data => {
                        this._taskListComponent.onBackdropClicked();
                        this.closeDrawer();
                        this._changeDetectorRef.markForCheck();
                    }
                );
            }
        });
    }

    trackByFn(index: number, item: any): any {
        return item.tagId || index;
    }
}
