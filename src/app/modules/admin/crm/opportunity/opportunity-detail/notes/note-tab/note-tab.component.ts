import { Component, OnInit ,ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import { EMPTY, catchError, combineLatest, filter, map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep } from 'lodash';
import { NoteDetailComponent } from '../note-detail/note-detail.component';
import { OpportunityService } from '../../../opportunity.service';
import { Note } from '../../../opportunity.types';

@Component({
  selector: 'app-note-tab',
  templateUrl: './note-tab.component.html',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class NoteTabComponent implements OnInit {
  constructor(
    private _opportunityService:OpportunityService,
    private _matDialog: MatDialog,
    // private _changeDetectorRef: ChangeDetectorRef,

  ) { }
  notes$ = this._opportunityService.notes$;
  users$ = this._opportunityService.users$;
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
    this._opportunityService.searchQuery$,
    this.notesWithUser$,
  ]).pipe(
    map(([search, notes]) => !search || !search.trim() ? notes :
      notes.filter(note => 
        note.noteTitle.toLowerCase().includes(search.trim().toLowerCase())
      )
    ),
  );
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
