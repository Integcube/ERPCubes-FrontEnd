import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, combineLatest, forkJoin } from 'rxjs';
import { takeUntil, tap, map, catchError } from 'rxjs/operators';
import { Note } from '../../../lead.type';
import { LeadService } from '../../../lead.service';

@Component({
  selector: 'app-note-detail',
  templateUrl: './note-detail.component.html',
  styleUrls: ['./note-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteDetailComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  noteWithData$ = combineLatest([
    this._leadService.note$,
    this._leadService.selectedNoteTask$,
    this._leadService.selectedNoteTag$
  ]).pipe(
    map(([note, tasks, tags]) => ({
      ...note,
      tags: tags,
      tasks: tasks
    })),
  );

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) private _data: { note: Note },
    private _leadService: LeadService,
    private _matDialogRef: MatDialogRef<NoteDetailComponent>
  ) { }
  ngOnInit(): void {
    if (this._data.note.noteId) {
      this._leadService.getNoteById(this._data.note.noteId).pipe(
        takeUntil(this._unsubscribeAll),
      ).subscribe(
        (data) => {
          this._changeDetectorRef.markForCheck();
        },
        error => {
          console.error("Error fetching data: ", error);
        }
      );
    }
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  closeDialog(): void {
    this._matDialogRef.close();
  }
}
