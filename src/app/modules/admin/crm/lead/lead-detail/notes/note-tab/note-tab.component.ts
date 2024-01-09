import { Component, OnInit ,ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import { EMPTY, catchError, combineLatest, filter, map } from 'rxjs';
import { LeadService } from '../../../lead.service';
import { Note } from '../../../lead.type';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep } from 'lodash';
import { NoteDetailComponent } from '../note-detail/note-detail.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-note-tab',
  templateUrl: './note-tab.component.html',
  styleUrls: ['./note-tab.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class NoteTabComponent implements OnInit {
  notes$ = this._leadService.notes$;
  users$ = this._leadService.users$;
  private _matDialogRef: MatDialogRef<NoteTabComponent>
  notesWithUser$ = combineLatest([
    this.notes$,
    this.users$
  ]).pipe(
    map(([notes, users]) =>
    notes.map(note => ({
        ...note,
        userName : users.find(a=>a.id === note.createdBy).name
      } as Note))
    ),
    catchError(error=>{alert(error);return EMPTY})
  );
  filteredData$ = combineLatest([
    this._leadService.searchQuery$,
    this.notesWithUser$,
  ]).pipe(
    map(([search, notes]) => !search || !search.trim() ? notes :
      notes.filter(note => 
        note.noteTitle.toLowerCase().includes(search.trim().toLowerCase())
      )
    ),
  );
  constructor(
    private _leadService:LeadService,
    private _matDialog: MatDialog,
    // private _changeDetectorRef: ChangeDetectorRef,

  ) { }

  ngOnInit(): void {
  }
  addNote(){
    let note = new Note({})
    // this._changeDetectorRef.markForCheck();
    this._matDialog.open(NoteDetailComponent, {
      autoFocus: false,
      data     : {
          note: cloneDeep(note)
      }
  });
  }

  close(): void {
    this._matDialogRef.close();
  }
  updateNote(note:Note):void{
    // this._changeDetectorRef.markForCheck();
    this._matDialog.open(NoteDetailComponent, {
      autoFocus: false,
      data     : {
          note: cloneDeep(note)
      }
  });
  }
}
