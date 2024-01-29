import { Component, OnInit ,ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import { EMPTY, combineLatest, filter, map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep } from 'lodash';
import { Note } from '../../../company.type';
import { NoteDetailComponent } from '../note-detail/note-detail.component';
import { CompanyService } from '../../../company.service';

@Component({
  selector: 'app-note-tab',
  templateUrl: './note-tab.component.html',
  styleUrls: ['./note-tab.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class NoteTabComponent implements OnInit {
  notes$ = this._companyService.notes$;
  users$ = this._companyService.users$;
  notesWithUser$ = combineLatest([
    this.notes$,
    this.users$
  ])
  .pipe(
    map(([notes, users]) =>
    notes.map(note => ({
        ...note,
        userName : users.find(a=>a.id === note.createdBy).name
      } as Note))
    )
  );
  
  filteredData$ = combineLatest([
    this._companyService.searchQuery$,
    this.notesWithUser$,
  ]).pipe(
    map(([search, notes]) => !search || !search.trim() ? notes :
      notes.filter(note => 
        note.noteTitle.toLowerCase().includes(search.trim().toLowerCase())
      )
    ),
  );
  constructor(
    private _companyService:CompanyService,
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
