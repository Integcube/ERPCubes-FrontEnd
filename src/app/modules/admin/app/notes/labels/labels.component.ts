import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { debounceTime, filter, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { NotesService } from '../notes.service';
import { Tag } from '../notes.types';


@Component({
    selector       : 'notes-labels',
    templateUrl    : './labels.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotesLabelsComponent implements OnInit, OnDestroy
{
    tags$ = this._notesService.tags$;

    labelChanged: Subject<Tag> = new Subject<Tag>();
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _notesService: NotesService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
      

        // Subscribe to label updates
        this.labelChanged
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(500),
                filter(tag => tag.tagTitle.trim() !== ''),
                switchMap(label => this._notesService.saveTags(label.tagTitle, label.tagId)))
            .subscribe(() => {

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this.tags$ = this._notesService.tags$;
        this._notesService.getTags().subscribe();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        // this._unsubscribeAll.next(null);
        // this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Add label
     *
     * @param title
     */
    addLabel(title: string): void
    {
        this._notesService.saveTags(title, -1).subscribe(() => {
            this._notesService.getTags().subscribe();
        });
    }

    /**
     * Update label
     */
    updateLabel(label: Tag): void
    {
        this.labelChanged.next(label);
    }

    /**
     * Delete label
     *
     * @param id
     */
    deleteLabel(id: number): void
    {
        this._notesService.deleteTags(id).subscribe(() => {

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
