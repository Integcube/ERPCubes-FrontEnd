import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EMPTY, Observable, Subject, combineLatest, forkJoin } from 'rxjs';
import { takeUntil, tap, map, catchError, take } from 'rxjs/operators';
import { Company, Note, Tag, Tasks } from '../../../company.type';
import { CompanyService } from '../../../company.service';

@Component({
  selector: 'app-note-detail',
  templateUrl: './note-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteDetailComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  company: Company;
  note: Note; 
  tags: Tag[];
  task: Tasks[];
  tags$ = this._companyService.tags$;
  noteChanged: Subject<Note> = new Subject<Note>();

  noteWithData$ = combineLatest([
    this._companyService.note$,
    this._companyService.selectedNoteTask$,
    this._companyService.selectedNoteTag$
  ]).pipe(
    map(([note, tasks, tags]) => ({
      ...note,
      tags: tags,
      tasks: tasks
    })),
  );

  constructor(
    public matDialogRef: MatDialogRef<NoteDetailComponent>,
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) private _data: { note: Note },
    private _companyService: CompanyService,
    private _matDialogRef: MatDialogRef<NoteDetailComponent>
  ) { }
  ngOnInit(): void {
        if (this._data.note.noteId) {
      this._companyService.getNoteById(this._data.note.noteId).pipe(
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
        (data)=>{
          this.note = {
            noteId: data.noteId,
            noteTitle: data.noteTitle,
            content: data.content,
            createdBy: data.createdBy,
            userName: data.userName,
            createdDate: data.createdDate,
            tags: data.tags,
            tasks: data.tasks,
          };
          this._changeDetectorRef.markForCheck();
        },
        error=> {
          console.error("Error fetching data: ", error);
        }
      )
      this._companyService.company$.pipe(takeUntil(this._unsubscribeAll)).subscribe(data =>{ this.company = { ...data };})
    }
    
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
      taskId: undefined,
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
    this._companyService.saveNote(this.note, this.company.companyId).subscribe(data=>this.closeDialog());
   }
   delete(){
    this._companyService.deleteNote(this.note.noteId,this.company.companyId).pipe(takeUntil(this._unsubscribeAll)).subscribe(data => this.closeDialog())
   }
}

