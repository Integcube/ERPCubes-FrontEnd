import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EMPTY, Observable, Subject, combineLatest, forkJoin } from 'rxjs';
import { takeUntil, tap, map, catchError, take } from 'rxjs/operators';
import { Note, Tag, Tasks } from '../notes.types';
import { NotesService } from '../notes.service';


@Component({
    selector       : 'notes-details',
    templateUrl    : './details.component.html',
    
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotesDetailsComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  note: Note; 
  tags: Tag[];
  task: Tasks[];
  tags$ = this._notesService.tags$;
  
  noteChanged: Subject<Note> = new Subject<Note>();

  noteWithData$ = combineLatest([
    this._notesService.note$,
    this._notesService.selectedNoteTask$,
    this._notesService.selectedNoteTag$
  ]).pipe(
    map(([note, tasks, tags]) => ({
      ...note,
      tags: tags,
      tasks: tasks
    })),
  );

  constructor(
    public matDialogRef: MatDialogRef<NotesDetailsComponent>,
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) private _data: { note: Note },
    private _notesService: NotesService,
    private _matDialogRef: MatDialogRef<NotesDetailsComponent>
  ) { }
  ngOnInit(): void {
        if (this._data.note.noteId) {
      this._notesService.getNoteById(this._data.note.noteId).pipe(
        takeUntil(this._unsubscribeAll),
      ).subscribe(
        (data) => {
          this._changeDetectorRef.markForCheck();
        },
        error => {
          console.error("Error fetching data: ", error);
        }
      );
      this.noteWithData$.pipe(
        takeUntil(this._unsubscribeAll),
      ).subscribe(
        (data) => {
          this.note = {
            noteId: data.noteId,
            noteTitle: data.noteTitle,
            content: data.content,
            createdBy: data.createdBy,
            userName: data.userName,
            id: data.id,
            createdDate: data.createdDate,
            tags: data.tags,
            tasks: data.tasks,
            createdByName: "",
          };
          this._changeDetectorRef.markForCheck();
        },
        error => {
          console.error("Error fetching data: ", error);
        }
      );
    }
    this.tags$ = this._notesService.tags$;
    this._notesService.getTags().subscribe();
    
  }
  updateNoteDetails(note: Note): void
  {
      this.noteChanged.next(note);
  }
    isNoteHasLabel(note: Note, tag: Tag): boolean {
    return !!note.tags.find(item => item.tagId === tag.tagId);
  }
  toggleLabelOnNote(tag: Tag): void {
    // If the note already has the label
    if (this.isNoteHasLabel(this.note, tag)) {
      this.note.tags = this.note.tags.filter(item => item.tagId !== tag.tagId)    
    } 
    else {
      this.note.tags.push(tag);
    }

    // Update the note 
    this.noteChanged.next(this.note);
  }
  
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  closeDialog(): void {
    this._matDialogRef.close();
  }
  addTasksToNote(): void {
    if (!this.note.tasks) {
      this.note.tasks = [];
    }
  }

  addTaskToNote(taskText: string): void {
    if (taskText.trim() === '') {
      return;
    }

    const newTask: Tasks = {
      taskId: -1,
      task: taskText,
      isCompleted: false,
      noteId: this.note.noteId,
    };

    this.note.tasks.push(newTask);
  }

  updateTaskOnNote(task: Tasks): void {
    // If the task is already available on the item
    if (task.taskId) {
      // Update the note
      this.noteChanged.next(this.note);
    }
  }
  removeTaskFromNote(task: Tasks): void {
    // Remove the task
    this.note.tasks = this.note.tasks.filter(item => item.task !== task.task);

    // Update the note
    this.noteChanged.next(this.note);
  }
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
  save(){
    this._notesService.saveNote(this.note).subscribe(data=>this.closeDialog());
   }
   delete(){
    this._notesService.deleteNote(this.note.noteId).pipe(takeUntil(this._unsubscribeAll)).subscribe(data => this.closeDialog())
   }
}

