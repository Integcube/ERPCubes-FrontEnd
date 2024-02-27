import { Component, OnInit ,ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import { combineLatest, map } from 'rxjs';
import { LeadService } from '../../../lead.service';
import { Note } from '../../../lead.type';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep } from 'lodash';
import { NoteDetailComponent } from '../note-detail/note-detail.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-note-tab',
  templateUrl: './note-tab.component.html',
  styleUrls: ['./note-tab.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class NoteTabComponent implements OnInit {
  private _matDialogRef: MatDialogRef<NoteTabComponent>
  constructor(
    private _leadService:LeadService,
    private _matDialog: MatDialog)
  { }

  notes$ = this._leadService.notes$;
  users$ = this._leadService.users$;
  notesWithUser$ = this.notes$;
  filteredData$ = combineLatest([
    this._leadService.searchQuery$,
    this.notesWithUser$,
  ])
  .pipe(
    map(([search, notes]) => !search || !search.trim() ? notes :
      notes.filter(note => 
        note.noteTitle.toLowerCase().includes(search.trim().toLowerCase())
      )
    ),
  );



  ngOnInit(): void { }

  addNote(){
    let note = new Note({})
    // this._changeDetectorRef.markForCheck();
    this._matDialog.open(NoteDetailComponent, {
      autoFocus: false,
      data : {
        note: cloneDeep(note)
      }
    });
  }


  updateNote(note:Note):void{
    // this._changeDetectorRef.markForCheck();
    this._matDialog.open(NoteDetailComponent, {
      autoFocus: false,
      data : {
        note: cloneDeep(note)
      }
    });
  }

  close(): void {
    this._matDialogRef.close();
  }
}
