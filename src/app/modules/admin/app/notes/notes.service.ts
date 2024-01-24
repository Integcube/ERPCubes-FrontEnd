import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, debounceTime, EMPTY, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { cloneDeep } from 'lodash-es';
import {  Note, Tag, Tasks } from './notes.types';
import { environment } from 'environments/environment';
import { User } from 'app/core/user/user.types';
import { ContactEnum } from 'app/core/enum/crmEnum';
import { UserService } from 'app/core/user/user.service';

@Injectable({
    providedIn: 'root'
})
export class NotesService
{

    private readonly getNotesUrl = `${environment.url}/Notes/NoteTask`
    private readonly getLeadTaskUrl = `${environment.url}/Task/all`
    private readonly allTagsUrl = `${environment.url}/Tags/all`
    private readonly getUsersUrl = `${environment.url}/Users/all`
    private readonly saveNotesUrl = `${environment.url}/Notes/save`
    private readonly getTaskUrl = `${environment.url}/Notes/tasks`
    private readonly getTagsUrl = `${environment.url}/Notes/tags`
    private readonly saveTagsURL = `${environment.url}/Tags/save`
    private readonly deleteNotesURL = `${environment.url}/Notes/delete`
    private readonly deleteTagsURL = `${environment.url}/Tags/delete`

    user: User;
    // Private
    private _tags: BehaviorSubject<Tag[] | null> = new BehaviorSubject(null);
    private _note: BehaviorSubject<Note | null> = new BehaviorSubject(null);
    private _notes: BehaviorSubject<Note[] | null> = new BehaviorSubject(null);
    private _users: BehaviorSubject<User[] | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */

    private contactEnumInstance: ContactEnum;

    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
        )
    {
        this._userService.user$.subscribe(user => {
            this.user = user;
          })
          this.contactEnumInstance = new ContactEnum();
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------
    get users$(): Observable<User[]> {
        return this._users.asObservable();
      }
    /**
     * Getter for labels
     */
    get tags$(): Observable<Tag[]>
    {
        return this._tags.asObservable();
    }

    /**
     * Getter for notes
     */
    get notes$(): Observable<Note[]>
    {
        return this._notes.asObservable();
    }

    /**
     * Getter for note
     */
    get note$(): Observable<Note>
    {
        return this._note.asObservable();
    }
    selectedNoteTask$ = this.note$.pipe(
        switchMap((note) => {
          if (note.noteId != -1) {
            return this._httpClient.post<Tasks[]>(this.getTaskUrl, {
              id: this.user.id,
              tenantId: this.user.tenantId,
              noteId: note.noteId
            }).pipe(
              debounceTime(300),
            )
          }
          else {
            return of([]);
          }
        }),
        catchError(error => { alert(error); return EMPTY })
      )
      selectedNoteTag$ = this.note$.pipe(
        switchMap((note) => {
          if (note.noteId != -1) {
            return this._httpClient.post<Tag[]>(this.getTagsUrl, {
              id: this.user.id,
              tenantId: this.user.tenantId, noteId: note.noteId
            }).pipe(
              debounceTime(300),
            )
          }
          else {
            return of([]);
          }
        })
        ,
        catchError(error => { alert(error); return EMPTY })
      )
      
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get labels
     */

    getTags(): Observable<Tag[]> {
        let data = {
          id: this.user.id,
          tenantId: this.user.tenantId,
        }
        return this._httpClient.post<Tag[]>(this.allTagsUrl, data).pipe(
          tap((tags) => {
            this._tags.next(tags);
          }),
          catchError(error => { alert(error); return EMPTY })
        );
      }

      getUsers(): Observable<User[]> {
        let data = {
          id: "-1",
          tenantId: this.user.tenantId,
        }
        return this._httpClient.post<User[]>(this.getUsersUrl, data).pipe(
          tap((users) => {
            this._users.next(users);
          }),
          catchError(error => { alert(error); return EMPTY })
    
        );
      }

    /**
     * Add label
     *
     * @param title
     */
    // addTags(title: string): Observable<Tag[]>
    // {
    //     return this._httpClient.post<Tag[]>('api/apps/notes/tags', {title}).pipe(
    //         tap((tags) => {

    //             // Update the labels
    //             this._tags.next(tags);
    //         })
    //     );
    // }

    /**
     * Update label
     *
     * @param label
     */
    // updateLabel(label: Tag): Observable<Tag[]>
    // {
    //     return this._httpClient.patch<Tag[]>('api/apps/notes/labels', {label}).pipe(
    //         tap((tags) => {

    //             // Update the notes
    //             this.getNotes().subscribe();

    //             // Update the labels
    //             this._tags.next(tags);
    //         })
    //     );
    // }
    // addLabel(title: string): Observable<Tag[]>
    // {
    //     return this._httpClient.post<Tag[]>('api/apps/notes/labels', {title}).pipe(
    //         tap((tags) => {

    //             // Update the labels
    //             this._tags.next(tags);
    //         })
    //     );
    // }
    /**
     * Delete a label
     *
     * @param id
     */
    deleteTags(id: number): Observable<Tag[]> {
        let data = {
            tenantId: this.user.tenantId,
            tagId: id,
            lastModifiedBy: this.user.id,
        }
        return this._httpClient.post<Tag[]>(this.deleteTagsURL, data).pipe(
            tap(() => {
                this.getTags().subscribe();
            })
        );
    }

    /**
     * Get notes
     */
    getNotes(): Observable<Note[]> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            
        }
        return this._httpClient.post<Note[]>(this.getNotesUrl, data).pipe(
          tap((notes) => {
            this._notes.next(notes);
          }),
          catchError(error => { alert(error); return EMPTY })
    
        );
      }
      getNotesTag(): Observable<Tag[]> {
        let data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
        }
        return this._httpClient.post<Tag[]>(this.getTagsUrl, data).pipe(
          tap((notes) => {
            this._tags.next(notes);
          }),
          catchError(error => { alert(error); return EMPTY })
    
        );
      }


    /**
     * Get note by id
     */

    getNoteById(id: number): Observable<Note> {
        return this._notes.pipe(
          take(1),
          map((notes) => {
            if (id == -1) {
              const note = new Note({});
              this._note.next(note);
              return note
            }
            else {
              const note = notes.find(value => value.noteId === id) || null;
              this._note.next(note);
              return note;
            }
          }),
          switchMap((note) => {
            if (!note) {
              return throwError('Could not found the note with id of ' + id + '!');
            }
            return of(note);
          })
        );
      }


    /**
     * Add task to the given note
     *
     * @param note
     * @param task
     */
    // addTask(note: Note, task: string): Observable<Note>
    // {
    //     return this._httpClient.post<Note>('api/apps/notes/tasks', {
    //         note,
    //         task
    //     }).pipe(switchMap(() => this.getNotes().pipe(
    //         switchMap(() => this.getNoteById(note.noteId))
    //     )));
    // }


    saveNote(note: Note): Observable<any> {
        let data = {
          id: this.user.id,
          tenantId: this.user.tenantId,
          contactTypeId:this.contactEnumInstance.All,
          note: {
            noteId: note.noteId,
            noteTitle: note.noteTitle,
            content: note.content,
            tags: note.tags ? note.tags.map(tag => tag.tagId).join(',') : '',
            tasks:note.tasks, 
          }
        };
        return this._httpClient.post<Note[]>(this.saveNotesUrl, data).pipe(
          tap(() => {
            this.getNotes().subscribe();
          }),
          catchError(error => {
            alert(error);
            return EMPTY;
          })
        );
      }

    deleteNote(noteId: number): Observable<Note> {
        let data = {
          id: this.user.id,
          tenantId: this.user.tenantId,
          noteId: noteId
        }
        return this._httpClient.post<Note>(this.deleteNotesURL, data).pipe(
          tap((note) => {
            this.getNotes().subscribe();
          }),
          catchError(error => { alert(error); return EMPTY })
        );
      }
    saveTags(tag: string, tagId:number): Observable<Tag> {
        const data = {
            id: this.user.id,
            tenantId: this.user.tenantId,
            createdBy: this.user.id,
            tagId: tagId,
            tagTitle: tag
        };
        return this._httpClient.post<Tag>(this.saveTagsURL, data).pipe(
            catchError(err => { alert(err.message); return EMPTY })
        )
    }
}
